from typing import List, Annotated
from fastapi import APIRouter, Depends, status, Query

from app.api.dependencies import get_user_repository, get_current_user
from app.schemas.user import UserCreate, UserResponse, UserUpdate
from app.models.user import UserModel
from app.services.user_service import UserService
from app.repositories.user_repository import UserRepository

router = APIRouter()

def get_user_service(repository: UserRepository = Depends(get_user_repository)) -> UserService:
    return UserService(repository)

# --- CREATE ---
@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_in: UserCreate,
    current_user: Annotated[UserModel, Depends(get_current_user)],
    service: UserService = Depends(get_user_service)
):
    return await service.create_user(user_in)

# --- READ ALL ---
@router.get("/", response_model=List[UserResponse])
async def read_users(
    current_user: Annotated[UserModel, Depends(get_current_user)],
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=100),
    service: UserService = Depends(get_user_service)
):
    return await service.get_users(skip=skip, limit=limit)

# --- READ ONE ---
@router.get("/{user_id}", response_model=UserResponse)
async def read_user(
    user_id: int,
    current_user: Annotated[UserModel, Depends(get_current_user)],
    service: UserService = Depends(get_user_service)
):
    return await service.get_user_by_id(user_id)

# --- UPDATE ---
@router.patch("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_in: UserUpdate,
    current_user: Annotated[UserModel, Depends(get_current_user)],
    service: UserService = Depends(get_user_service)
):
    return await service.update_user(user_id, user_in)

# --- DELETE ---
@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: int,
    current_user: Annotated[UserModel, Depends(get_current_user)],
    service: UserService = Depends(get_user_service)
):
    await service.delete_user(user_id)
    return None