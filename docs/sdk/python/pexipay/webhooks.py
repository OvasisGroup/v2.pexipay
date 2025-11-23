"""Webhook signature verification"""

import hmac
import hashlib
import json
from typing import Any, Dict


def verify_webhook_signature(payload: str, signature: str, webhook_secret: str) -> bool:
    """
    Verify webhook signature from Pexipay

    Args:
        payload: Raw webhook payload (as string)
        signature: Signature from X-Pexipay-Signature header
        webhook_secret: Your webhook secret from Pexipay dashboard

    Returns:
        True if signature is valid
    """
    try:
        expected_signature = hmac.new(
            webhook_secret.encode("utf-8"), payload.encode("utf-8"), hashlib.sha256
        ).hexdigest()

        return hmac.compare_digest(signature, expected_signature)
    except Exception:
        return False


def construct_webhook_event(payload: str, signature: str, webhook_secret: str) -> Dict[str, Any]:
    """
    Parse and verify webhook event

    Args:
        payload: Raw webhook payload
        signature: Signature from header
        webhook_secret: Your webhook secret

    Returns:
        Parsed webhook event

    Raises:
        ValueError: If signature is invalid
    """
    is_valid = verify_webhook_signature(payload, signature, webhook_secret)

    if not is_valid:
        raise ValueError("Invalid webhook signature")

    return json.loads(payload)
