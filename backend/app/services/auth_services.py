from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.core.security import hash_password
from app.core.security import verify_password
from app.core.jwt_handler import create_access_token
from app.models.user import User


def create_user(user, db: Session):

    existing_email = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    existing_username = (
        db.query(User)
        .filter(User.username == user.username)
        .first()
    )

    if existing_username:
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )

    db_user = User(
        email=user.email,
        username=user.username,
        hashed_password=hash_password(user.password)
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


def login_user(user, db: Session):

    db_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="User does not exist"
        )

    if not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect password"
        )

    token = create_access_token(
        {
            "sub": str(db_user.id)
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    } 