from jose import jwt, JWTError
from pydantic import ValidationError

from app.core.config import settings
from app.repositories.user_repository import UserRepository
from app.core.security import verify_password, create_access_token, create_refresh_token
from app.schemas.auth import Token, TokenType, TokenPayload
from app.core.exceptions import InvalidCredentialsError

class AuthService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    async def authenticate_user(self, email: str, password: str) -> Token:
        user = await self.user_repository.get_by_email(email)

        if not user or not verify_password(password, user.password_hash):
            raise InvalidCredentialsError()

        return Token(
            access_token=create_access_token(user.id),
            refresh_token=create_refresh_token(user.id),
        )

    async def refresh_access_token(self, refresh_token: str) -> Token:
        try:
            payload_dict = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
            token_payload = TokenPayload(**payload_dict)
            
        except (JWTError, ValidationError):
            raise InvalidCredentialsError()

        if token_payload.type != TokenType.REFRESH:
            raise InvalidCredentialsError()

        user_id = int(token_payload.sub)

        user = await self.user_repository.get_by_id(user_id)
        if not user:
             raise InvalidCredentialsError()

        return Token(
            access_token=create_access_token(user.id),
            refresh_token=create_refresh_token(user.id),
        )