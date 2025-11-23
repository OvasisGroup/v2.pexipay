"""Balance resource"""

from typing import TYPE_CHECKING, Optional, Dict, Any

if TYPE_CHECKING:
    from ..client import PexipayClient


class BalanceResource:
    """Balance API resource"""

    def __init__(self, client: "PexipayClient"):
        self.client = client

    def retrieve(self) -> Dict[str, Any]:
        """Retrieve account balance"""
        response = self.client.request("GET", "/balance")
        return response.get("data", response)

    def list_transactions(
        self,
        limit: Optional[int] = None,
        starting_after: Optional[str] = None,
        ending_before: Optional[str] = None,
    ) -> Dict[str, Any]:
        """List balance transactions"""
        params = {
            "limit": limit,
            "startingAfter": starting_after,
            "endingBefore": ending_before,
        }
        # Remove None values
        params = {k: v for k, v in params.items() if v is not None}

        return self.client.request("GET", "/balance/transactions", params=params)
