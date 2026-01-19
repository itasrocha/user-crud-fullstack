from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase
from app.core.config import settings

engine = create_async_engine(str(settings.DATABASE_URL), echo=True)

# Session Factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    expire_on_commit=False,
    autoflush=False
)

class Base(DeclarativeBase):
    pass

# Dependency Injection
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session