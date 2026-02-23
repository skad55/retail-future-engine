from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from ..db import get_db
from ..models import User
from ..security import hash_password, verify_password, create_access_token
from ..config import settings

router = APIRouter(
    prefix=f"{settings.API_PREFIX}/auth",
    tags=["auth"],
)

class RegisterIn(BaseModel):
    email: str
    # bcrypt limite 72 bytes ; on borne pour éviter 500
    password: str = Field(min_length=8, max_length=72)

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"

@router.post("/register", response_model=TokenOut)
def register(payload: RegisterIn, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email déjà utilisé",
        )

    user = User(
        email=payload.email,
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    db.commit()

    return {
        "access_token": create_access_token(payload.email),
        "token_type": "bearer",
    }

@router.post("/login", response_model=TokenOut)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Identifiants invalides",
        )

    return {
        "access_token": create_access_token(user.email),
        "token_type": "bearer",
    }