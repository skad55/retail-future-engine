from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import pandas as pd

from ..config import settings
from ..db import get_db
from ..deps import get_current_user
from ..models import Store, SaleRecord, User

router = APIRouter(prefix=f"{settings.API_PREFIX}/ingest", tags=["ingest"])


def _normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    # normalise en minuscules sans accents/espaces (minimum)
    df.columns = [c.strip().lower() for c in df.columns]
    return df


@router.post("/csv")
async def ingest_csv(
    store_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    store = db.query(Store).filter(Store.id == store_id, Store.owner_id == user.id).first()
    if not store:
        raise HTTPException(status_code=404, detail="Store introuvable")

    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Fichier CSV requis")

    content = await file.read()

    try:
        df = pd.read_csv(pd.io.common.BytesIO(content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"CSV illisible: {e}")

    df = _normalize_columns(df)

    # mapping colonnes tolérantes
    # attend: date, chiffre_affaires (ou revenue/ca), transactions (optionnel)
    date_col = None
    for c in ["date", "day", "jour"]:
        if c in df.columns:
            date_col = c
            break

    rev_col = None
    for c in ["chiffre_affaires", "ca", "revenue", "turnover"]:
        if c in df.columns:
            rev_col = c
            break

    tx_col = None
    for c in ["transactions", "tx", "tickets"]:
        if c in df.columns:
            tx_col = c
            break

    if not date_col or not rev_col:
        raise HTTPException(
            status_code=400,
            detail="Colonnes requises manquantes. Il faut au minimum: date + chiffre_affaires (ou revenue/ca).",
        )

    # parsing
    try:
        df[date_col] = pd.to_datetime(df[date_col]).dt.date
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Colonne date invalide: {e}")

    try:
        df[rev_col] = pd.to_numeric(df[rev_col])
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Colonne chiffre_affaires invalide: {e}")

    if tx_col:
        df[tx_col] = pd.to_numeric(df[tx_col], errors="coerce").fillna(0).astype(int)

    # upsert simple (par jour)
    inserted = 0
    updated = 0

    for _, row in df.iterrows():
        day = row[date_col]
        revenue = float(row[rev_col])
        transactions = int(row[tx_col]) if tx_col else None

        existing = (
            db.query(SaleRecord)
            .filter(SaleRecord.store_id == store.id, SaleRecord.day == day)
            .first()
        )

        if existing:
            existing.revenue = revenue
            existing.transactions = transactions
            updated += 1
        else:
            db.add(SaleRecord(store_id=store.id, day=day, revenue=revenue, transactions=transactions))
            inserted += 1

    db.commit()

    return {
        "store_id": store.id,
        "filename": file.filename,
        "inserted": inserted,
        "updated": updated,
        "rows": int(len(df)),
        "ingested_at": datetime.utcnow().isoformat() + "Z",
    }