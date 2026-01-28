from enum import Enum
from pydantic import BaseModel, ConfigDict, Field

class TokenType(str, Enum):
    ACCESS = "access"
    REFRESH = "refresh"

class TokenPayload(BaseModel):
    sub: str
    type: TokenType
    exp: int

    model_config = ConfigDict(extra='ignore') 

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"