from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

ph = PasswordHasher()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica se a senha em texto bate com o hash salvo."""
    try:
        return ph.verify(hashed_password, plain_password)
    except VerifyMismatchError:
        return False

def get_password_hash(password: str) -> str:
    """Gera o hash da senha."""
    return ph.hash(password)