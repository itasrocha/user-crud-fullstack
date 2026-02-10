import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

from app.main import app
from app.core.database import Base, get_session

SQLALCHEMY_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False}
)

TestingSessionLocal = async_sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)

@pytest_asyncio.fixture
async def db_session():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with TestingSessionLocal() as session:
        yield session
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest_asyncio.fixture
async def async_client(db_session):
    def override_get_session():
        yield db_session

    app.dependency_overrides[get_session] = override_get_session
    
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        yield client
    
    app.dependency_overrides.clear()

@pytest_asyncio.fixture
async def test_user(async_client):
    user_data = {
        "name": "Yakumo Yukari",
        "email": "trains@gap.jp",
        "password": "Ran_is_my_pet"
    }
    response = await async_client.post("/v1/auth/register", json=user_data)
    assert response.status_code == 200
    
    return user_data

@pytest_asyncio.fixture
async def auth_token(async_client, test_user):
    response = await async_client.post("/v1/auth/login", data={
        "username": test_user["email"],
        "password": test_user["password"]
    })
    assert response.status_code == 200
    return response.json()["access_token"]

@pytest_asyncio.fixture
async def authorized_client(async_client, auth_token):
    async_client.headers = {**async_client.headers, "Authorization": f"Bearer {auth_token}"}
    return async_client