from typing import Annotated
from fastapi import APIRouter, Depends, Body
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session 
from app.repositories.user_repository import UserRepository
from app.services.auth_service import AuthService
from app.schemas.auth import Token
from app.schemas.user import UserCreate, UserResponse
from app.models.user import UserModel
from app.api.dependencies import get_current_user

router = APIRouter()

async def get_auth_service(session: AsyncSession = Depends(get_session)) -> AuthService:
    repository = UserRepository(session)
    return AuthService(repository)


@router.post("/register", response_model=Token)
async def register(
    user_data: UserCreate,
    service: Annotated[AuthService, Depends(get_auth_service)]
):
    return await service.register_user(user_data)


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


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: Annotated[UserModel, Depends(get_current_user)]
):
    """Get the current authenticated user's info."""
    return current_user