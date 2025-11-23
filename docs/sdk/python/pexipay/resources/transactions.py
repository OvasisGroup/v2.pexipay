"""Transactions resource"""

from typing import TYPE_CHECKING, Optional, Dict, Any

if TYPE_CHECKING:
    from ..client import PexipayClient


class TransactionsResource:
    """Transactions API resource"""

    def __init__(self, client: "PexipayClient"):
        self.client = client

    def retrieve(self, transaction_id: str) -> Dict[str, Any]:
        """Retrieve a transaction by ID"""
        response = self.client.request("GET", f"/transactions/{transaction_id}")
        return response.get("data", response)

    def list(
        self,
        limit: Optional[int] = None,
        starting_after: Optional[str] = None,
        ending_before: Optional[str] = None,
        type: Optional[str] = None,
        status: Optional[str] = None,
        created_after: Optional[str] = None,
        created_before: Optional[str] = None,
    ) -> Dict[str, Any]:
        """List transactions"""
        params = {
            "limit": limit,
            "startingAfter": starting_after,
            "endingBefore": ending_before,
            "type": type,
            "status": status,
            "createdAfter": created_after,
            "createdBefore": created_before,
        }
        # Remove None values
        params = {k: v for k, v in params.items() if v is not None}

        return self.client.request("GET", "/transactions", params=params)
