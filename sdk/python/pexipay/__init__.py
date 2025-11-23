"""
Pexipay Python SDK
Official Python SDK for Pexipay card-to-crypto payment platform
"""

__version__ = "1.0.0"

from .client import PexipayClient
from .errors import (
    PexipayError,
    AuthenticationError,
    ValidationError,
    RateLimitError,
    NetworkError,
    ResourceNotFoundError,
    PaymentFailedError,
)
from .webhooks import verify_webhook_signature, construct_webhook_event

__all__ = [
    "PexipayClient",
    "PexipayError",
    "AuthenticationError",
    "ValidationError",
    "RateLimitError",
    "NetworkError",
    "ResourceNotFoundError",
    "PaymentFailedError",
    "verify_webhook_signature",
    "construct_webhook_event",
]
