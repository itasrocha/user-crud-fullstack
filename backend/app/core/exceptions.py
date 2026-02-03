class DomainError(Exception):
    """Base class for all business logic errors."""
    pass

class InvalidCredentialsError(DomainError):
    """Raised when authentication fails (passwords, tokens)."""
    pass

class ResourceNotFoundError(DomainError):
    """Raised when a specific resource (User, Item) is not found."""
    pass

class EmailAlreadyRegisteredError(DomainError):
    """Raised during registration if email is taken."""
    pass