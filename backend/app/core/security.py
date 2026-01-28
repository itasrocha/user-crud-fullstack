from datetime import datetime, timedelta, timezone
from typing import Any
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from jose import jwt

from app.core.config import settings
from app.schemas.auth import TokenPayload, TokenType

ph = PasswordHasher()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return ph.verify(hashed_password, plain_password)
    except VerifyMismatchError:
        return False

def get_password_hash(password: str) -> str:
    return ph.hash(password)

def create_access_token(subject: str | Any) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    payload = TokenPayload(
        sub=str(subject),
        type=TokenType.ACCESS,
        exp=int(expire.timestamp()) 
    )
    
    return jwt.encode(payload.model_dump(), settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

def create_refresh_token(subject: str | Any) -> str:
    expire = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    
    payload = TokenPayload(
        sub=str(subject),
        type=TokenType.REFRESH,
        exp=int(expire.timestamp())
    )
    
    return jwt.encode(payload.model_dump(), settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)