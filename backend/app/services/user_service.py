from typing import Sequence
from fastapi import HTTPException, status
from app.models.user import UserModel
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash
from app.repositories.user_repository import UserRepository

class UserService:
    def __init__(self, repository: UserRepository):
        self.repository = repository

    async def create_user(self, user_in: UserCreate) -> UserModel:
        if await self.repository.get_by_email(user_in.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        hashed_pw = get_password_hash(user_in.password)
        
        user_model = UserModel(
            name=user_in.name,
            email=user_in.email,
            password_hash=hashed_pw
        )

        return await self.repository.create(user_model)

    async def get_users(self, skip: int, limit: int) -> Sequence[UserModel]:
        return await self.repository.list_all(skip=skip, limit=limit)

    async def get_user_by_id(self, user_id: int) -> UserModel:
        user = await self.repository.get_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return user

    async def update_user(self, user_id: int, user_update: UserUpdate) -> UserModel:
        user_db = await self.get_user_by_id(user_id)

        if user_update.name is not None:
            user_db.name = user_update.name
        
        if user_update.email is not None:
            user_db.email = user_update.email

        if user_update.password is not None:
            user_db.password_hash = get_password_hash(user_update.password)

        return await self.repository.update(user_db)

    async def delete_user(self, user_id: int) -> None:
        user_db = await self.get_user_by_id(user_id)
        await self.repository.delete(user_db)