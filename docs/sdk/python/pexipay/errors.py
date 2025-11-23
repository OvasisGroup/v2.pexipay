"""Pexipay SDK Errors"""

from typing import Optional, Any


class PexipayError(Exception):
    """Base exception for Pexipay SDK"""

    def __init__(
        self,
        message: str,
        status_code: Optional[int] = None,
        code: Optional[str] = None,
        request_id: Optional[str] = None,
        details: Optional[Any] = None,
    ):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.code = code
        self.request_id = request_id
        self.details = details


class AuthenticationError(PexipayError):
    """Authentication failed"""

    def __init__(self, message: str = "Authentication failed", request_id: Optional[str] = None):
        super().__init__(message, 401, "authentication_error", request_id)


class ValidationError(PexipayError):
    """Validation error"""

    def __init__(self, message: str, details: Optional[Any] = None, request_id: Optional[str] = None):
        super().__init__(message, 400, "validation_error", request_id, details)


class RateLimitError(PexipayError):
    """Rate limit exceeded"""

    def __init__(
        self, message: str = "Rate limit exceeded", retry_after: Optional[int] = None, request_id: Optional[str] = None
    ):
        super().__init__(message, 429, "rate_limit_error", request_id)
        self.retry_after = retry_after


class NetworkError(PexipayError):
    """Network error"""

    def __init__(self, message: str = "Network error occurred"):
        super().__init__(message, None, "network_error")


class ResourceNotFoundError(PexipayError):
    """Resource not found"""

    def __init__(self, resource: str, resource_id: str, request_id: Optional[str] = None):
        message = f"{resource} not found: {resource_id}"
        super().__init__(message, 404, "resource_not_found", request_id)


class PaymentFailedError(PexipayError):
    """Payment failed"""

    def __init__(self, message: str, details: Optional[Any] = None, request_id: Optional[str] = None):
        super().__init__(message, 402, "payment_failed", request_id, details)
