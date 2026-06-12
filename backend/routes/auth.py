from fastapi import APIRouter, HTTPException

from database import db
from models.user import Token, UserCreate, UserLogin
from services.auth_service import create_access_token, hash_password, verify_password

router = APIRouter(tags=["auth"])


@router.post("/signup")
async def signup(user: UserCreate):
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    await db.users.insert_one(
        {
            "username": user.username,
            "email": user.email,
            "hashed_password": hash_password(user.password),
        }
    )
    return {"username": user.username, "email": user.email}


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(
        credentials.password, user["hashed_password"]
    ):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token({"sub": user["email"]})
    return Token(access_token=access_token)
