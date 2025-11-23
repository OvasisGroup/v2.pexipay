"""Payment Links resource"""

from typing import TYPE_CHECKING, Optional, Dict, Any

if TYPE_CHECKING:
    from ..client import PexipayClient


class PaymentLinksResource:
    """Payment Links API resource"""

    def __init__(self, client: "PexipayClient"):
        self.client = client

    def create(
        self,
        amount: float,
        currency: str,
        description: Optional[str] = None,
        customer_info: Optional[Dict[str, Any]] = None,
        return_url: Optional[str] = None,
        cancel_url: Optional[str] = None,
        webhook_url: Optional[str] = None,
        expires_at: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Create a new payment link"""
        data = {
            "amount": amount,
            "currency": currency,
            "description": description,
            "customerInfo": customer_info,
            "returnUrl": return_url,
            "cancelUrl": cancel_url,
            "webhookUrl": webhook_url,
            "expiresAt": expires_at,
            "metadata": metadata,
        }
        # Remove None values
        data = {k: v for k, v in data.items() if v is not None}

        response = self.client.request("POST", "/payment-links", data=data)
        return response.get("data", response)

    def retrieve(self, payment_link_id: str) -> Dict[str, Any]:
        """Retrieve a payment link by ID"""
        response = self.client.request("GET", f"/payment-links/{payment_link_id}")
        return response.get("data", response)

    def list(
        self,
        limit: Optional[int] = None,
        starting_after: Optional[str] = None,
        ending_before: Optional[str] = None,
        status: Optional[str] = None,
        created_after: Optional[str] = None,
        created_before: Optional[str] = None,
    ) -> Dict[str, Any]:
        """List payment links"""
        params = {
            "limit": limit,
            "startingAfter": starting_after,
            "endingBefore": ending_before,
            "status": status,
            "createdAfter": created_after,
            "createdBefore": created_before,
        }
        # Remove None values
        params = {k: v for k, v in params.items() if v is not None}

        return self.client.request("GET", "/payment-links", params=params)

    def cancel(self, payment_link_id: str) -> Dict[str, Any]:
        """Cancel a payment link"""
        response = self.client.request("POST", f"/payment-links/{payment_link_id}/cancel")
        return response.get("data", response)
