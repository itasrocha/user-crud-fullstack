from fastapi import FastAPI
from sqlalchemy.exc import IntegrityError, OperationalError
from app.core.exceptions import DomainError, InvalidCredentialsError, ResourceNotFoundError, EmailAlreadyRegisteredError
from app.api.errors import (
    domain_exception_handler,
    email_already_registered_handler,
    invalid_credentials_handler,
    resource_not_found_handler,
    integrity_error_handler, 
    operational_error_handler, 
    global_exception_handler,
)

def create_application() -> FastAPI:
    """Factory function to create and configure the app."""
    app = FastAPI(title="User CRUD")

    # Domain
    app.add_exception_handler(InvalidCredentialsError, invalid_credentials_handler)
    app.add_exception_handler(ResourceNotFoundError, resource_not_found_handler)
    app.add_exception_handler(EmailAlreadyRegisteredError, email_already_registered_handler)
    app.add_exception_handler(DomainError, domain_exception_handler)

    # DB/Infra
    app.add_exception_handler(IntegrityError, integrity_error_handler)
    app.add_exception_handler(OperationalError, operational_error_handler)

    # Global Fallback
    app.add_exception_handler(Exception, global_exception_handler)

    return app