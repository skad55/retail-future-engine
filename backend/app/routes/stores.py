from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..config import settings
from ..db import get_db
from ..deps import get_current_user
from ..models import Store, User
from ..schemas import StoreCreate, StoreUpdate, StoreOut

router = APIRouter(prefix=f"{settings.API_PREFIX}/stores", tags=["stores"])


def _get_store_for_user(db: Session, user_id: int, store_id: int) -> Store:
    store = db.query(Store).filter(Store.id == store_id, Store.owner_id == user_id).first()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    return store


@router.post("", response_model=StoreOut, status_code=status.HTTP_201_CREATED)
def create_store(
    payload: StoreCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    store = Store(owner_id=user.id, name=payload.name)
    db.add(store)
    db.commit()
    db.refresh(store)
    return store


@router.get("", response_model=list[StoreOut])
def list_stores(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    stores = db.query(Store).filter(Store.owner_id == user.id).order_by(Store.id.asc()).all()
    return stores


@router.get("/{store_id}", response_model=StoreOut)
def get_store(
    store_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return _get_store_for_user(db, user.id, store_id)


@router.put("/{store_id}", response_model=StoreOut)
def update_store(
    store_id: int,
    payload: StoreUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    store = _get_store_for_user(db, user.id, store_id)
    store.name = payload.name
    db.commit()
    db.refresh(store)
    return store


@router.delete("/{store_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_store(
    store_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    store = _get_store_for_user(db, user.id, store_id)
    db.delete(store)
    db.commit()
    return None