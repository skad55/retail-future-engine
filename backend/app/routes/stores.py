from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..config import settings
from ..db import get_db
from ..deps import get_current_user
from ..models import Store, User

router = APIRouter(prefix=f"{settings.API_PREFIX}/stores", tags=["stores"])


@router.post("")
def create_store(
    name: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    store = Store(owner_id=user.id, name=name)
    db.add(store)
    db.commit()
    db.refresh(store)
    return {"id": store.id, "name": store.name}


@router.get("")
def list_stores(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    stores = db.query(Store).filter(Store.owner_id == user.id).all()
    return [{"id": s.id, "name": s.name} for s in stores]