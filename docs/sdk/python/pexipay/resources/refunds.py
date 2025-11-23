"""Refunds resource"""

from typing import TYPE_CHECKING, Optional, Dict, Any

if TYPE_CHECKING:
    from ..client import PexipayClient


class RefundsResource:
    """Refunds API resource"""

    def __init__(self, client: "PexipayClient"):
        self.client = client

    def create(
        self,
        payment_id: str,
        amount: Optional[float] = None,
        reason: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Create a new refund"""
        data = {
            "paymentId": payment_id,
            "amount": amount,
            "reason": reason,
            "metadata": metadata,
        }
        # Remove None values
        data = {k: v for k, v in data.items() if v is not None}

        response = self.client.request("POST", "/refunds", data=data)
        return response.get("data", response)

    def retrieve(self, refund_id: str) -> Dict[str, Any]:
        """Retrieve a refund by ID"""
        response = self.client.request("GET", f"/refunds/{refund_id}")
        return response.get("data", response)

    def list(
        self,
        limit: Optional[int] = None,
        starting_after: Optional[str] = None,
        ending_before: Optional[str] = None,
        payment_id: Optional[str] = None,
        status: Optional[str] = None,
        created_after: Optional[str] = None,
        created_before: Optional[str] = None,
    ) -> Dict[str, Any]:
        """List refunds"""
        params = {
            "limit": limit,
            "startingAfter": starting_after,
            "endingBefore": ending_before,
            "paymentId": payment_id,
            "status": status,
            "createdAfter": created_after,
            "createdBefore": created_before,
        }
        # Remove None values
        params = {k: v for k, v in params.items() if v is not None}

        return self.client.request("GET", "/refunds", params=params)

    def cancel(self, refund_id: str) -> Dict[str, Any]:
        """Cancel a refund"""
        response = self.client.request("POST", f"/refunds/{refund_id}/cancel")
        return response.get("data", response)
