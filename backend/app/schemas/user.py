from pydantic import BaseModel, EmailStr, ConfigDict, Field
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=100, examples=["Hakurei Reimu", "Kirisame Marisa"])
    email: EmailStr = Field(..., examples=["donations-wanted@hakurei.jp", "daze@kirisame.jp"])

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, examples=["100YenOrBust!", "MasterSpark_8oz"])

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=3, max_length=100)
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=8)

class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)