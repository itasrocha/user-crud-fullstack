from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.config import settings
from app.models.user import UserModel
from app.repositories.user_repository import UserRepository
from app.schemas.auth import TokenPayload, TokenType
from app.core.exceptions import InvalidCredentialsError, ResourceNotFoundError

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

async def get_user_repository(db: AsyncSession = Depends(get_session)) -> UserRepository:
    return UserRepository(db)

async def get_current_user_id(
    token: Annotated[str, Depends(oauth2_scheme)]
) -> int:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        token_payload = TokenPayload(**payload)
    except (JWTError, ValidationError):
        raise InvalidCredentialsError()

    if token_payload.sub is None:
        raise InvalidCredentialsError()
    
    if token_payload.type != TokenType.ACCESS:
        raise InvalidCredentialsError()
        
    return int(token_payload.sub)

async def get_current_user(
    user_id: Annotated[int, Depends(get_current_user_id)],
    session: Annotated[AsyncSession, Depends(get_session)]
) -> UserModel:
    repository = UserRepository(session)
    user = await repository.get_by_id(user_id)
    
    if user is None:
        raise ResourceNotFoundError(f"User with id {user_id} not found")
        
    return user