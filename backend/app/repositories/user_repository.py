from typing import Sequence, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.user import UserModel

class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, user: UserModel) -> UserModel:
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def get_by_id(self, user_id: int) -> Optional[UserModel]:
        return await self.db.get(UserModel, user_id)

    async def get_by_email(self, email: str) -> Optional[UserModel]:
        query = select(UserModel).where(UserModel.email == email)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def list_all(self, skip: int = 0, limit: int = 100) -> Sequence[UserModel]:
        query = select(UserModel).offset(skip).limit(limit)
        result = await self.db.execute(query)
        return result.scalars().all()

    async def update(self, user: UserModel) -> UserModel:
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def delete(self, user: UserModel) -> None:
        await self.db.delete(user)
        await self.db.commit()