from fastapi import HTTPException, status
from jose import jwt, JWTError
from pydantic import ValidationError

from app.core.config import settings
from app.repositories.user_repository import UserRepository
from app.core.security import verify_password, create_access_token, create_refresh_token
from app.schemas.auth import Token, TokenType, TokenPayload

class AuthService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    async def authenticate_user(self, email: str, password: str) -> Token:
        user = await self.user_repository.get_by_email(email)

        if not user or not verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return Token(
            access_token=create_access_token(user.id),
            refresh_token=create_refresh_token(user.id),
        )

    async def refresh_access_token(self, refresh_token: str) -> Token:
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
        try:
            payload_dict = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
            token_payload = TokenPayload(**payload_dict)
            
        except (JWTError, ValidationError):
            raise credentials_exception

        if token_payload.type != TokenType.REFRESH:
            raise credentials_exception

        user_id = int(token_payload.sub)

        user = await self.user_repository.get_by_id(user_id)
        if not user:
             raise credentials_exception

        return Token(
            access_token=create_access_token(user.id),
            refresh_token=create_refresh_token(user.id),
        )