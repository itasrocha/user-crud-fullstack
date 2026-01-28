from typing import Annotated
from fastapi import APIRouter, Depends, Body
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session 
from app.repositories.user_repository import UserRepository
from app.services.auth_service import AuthService
from app.schemas.auth import Token

router = APIRouter()

async def get_auth_service(session: AsyncSession = Depends(get_session)) -> AuthService:
    repository = UserRepository(session)
    return AuthService(repository)


@router.post("/login", response_model=Token)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    service: Annotated[AuthService, Depends(get_auth_service)]
):
    return await service.authenticate_user(
        email=form_data.username, 
        password=form_data.password
    )

@router.post("/refresh", response_model=Token)
async def refresh_token(
    refresh_token: Annotated[str, Body(embed=True)],
    service: Annotated[AuthService, Depends(get_auth_service)]
):
    return await service.refresh_access_token(refresh_token)