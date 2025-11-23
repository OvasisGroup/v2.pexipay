"""Payments resource"""

from typing import TYPE_CHECKING, Optional, Dict, Any, List

if TYPE_CHECKING:
    from ..client import PexipayClient


class PaymentsResource:
    """Payments API resource"""

    def __init__(self, client: "PexipayClient"):
        self.client = client

    def create(
        self,
        amount: float,
        currency: str,
        description: Optional[str] = None,
        payment_method: Optional[Dict[str, Any]] = None,
        customer_email: Optional[str] = None,
        customer_name: Optional[str] = None,
        return_url: Optional[str] = None,
        cancel_url: Optional[str] = None,
        webhook_url: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Create a new payment"""
        data = {
            "amount": amount,
            "currency": currency,
            "description": description,
            "paymentMethod": payment_method,
            "customerEmail": customer_email,
            "customerName": customer_name,
            "returnUrl": return_url,
            "cancelUrl": cancel_url,
            "webhookUrl": webhook_url,
            "metadata": metadata,
        }
        # Remove None values
        data = {k: v for k, v in data.items() if v is not None}

        response = self.client.request("POST", "/payments", data=data)
        return response.get("data", response)

    def retrieve(self, payment_id: str) -> Dict[str, Any]:
        """Retrieve a payment by ID"""
        response = self.client.request("GET", f"/payments/{payment_id}")
        return response.get("data", response)

    def list(
        self,
        limit: Optional[int] = None,
        starting_after: Optional[str] = None,
        ending_before: Optional[str] = None,
        status: Optional[str] = None,
        customer_email: Optional[str] = None,
        created_after: Optional[str] = None,
        created_before: Optional[str] = None,
    ) -> Dict[str, Any]:
        """List payments"""
        params = {
            "limit": limit,
            "startingAfter": starting_after,
            "endingBefore": ending_before,
            "status": status,
            "customerEmail": customer_email,
            "createdAfter": created_after,
            "createdBefore": created_before,
        }
        # Remove None values
        params = {k: v for k, v in params.items() if v is not None}

        return self.client.request("GET", "/payments", params=params)

    def confirm_3ds(self, payment_id: str, three_ds_result: str) -> Dict[str, Any]:
        """Confirm 3D Secure authentication"""
        data = {"threeDSResult": three_ds_result}
        response = self.client.request("POST", f"/payments/{payment_id}/3ds/confirm", data=data)
        return response.get("data", response)

    def cancel(self, payment_id: str) -> Dict[str, Any]:
        """Cancel a payment"""
        response = self.client.request("POST", f"/payments/{payment_id}/cancel")
        return response.get("data", response)

    def capture(self, payment_id: str, amount: Optional[float] = None) -> Dict[str, Any]:
        """Capture a payment"""
        data = {"amount": amount} if amount is not None else {}
        response = self.client.request("POST", f"/payments/{payment_id}/capture", data=data)
        return response.get("data", response)
