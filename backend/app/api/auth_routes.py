from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.user import UserCreate, LoginRequest
from app.services.auth_services import (
    create_user,
    login_user
)

from app.dependencies.auth import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/signup")
def signup(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    return create_user(user, db)


@router.post("/login")
def login(
    user: LoginRequest,
    db: Session = Depends(get_db)
):
    return login_user(user, db)


@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user)
):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "username": current_user.username
    }

@router.get("/protected")
def protected_route(
    current_user: User = Depends(get_current_user)
):
    return {
        "message": f"Hello {current_user.username}"
    }