from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import IntegrityError, OperationalError

from app.core.database import engine, Base
from app.api.v1.endpoints import users, auth
from app.core.setup import create_application

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = create_application()
app.router.lifespan_context = lifespan

origins = ["http://localhost:5173","http://127.0.0.1:5173",]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router, prefix="/v1/users", tags=["users"])
app.include_router(auth.router, prefix="/v1/auth", tags=["auth"])

@app.get("/")
def read_root():
    return {"status": "ok"}