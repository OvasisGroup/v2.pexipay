"""Customers resource"""

from typing import TYPE_CHECKING, Optional, Dict, Any

if TYPE_CHECKING:
    from ..client import PexipayClient


class CustomersResource:
    """Customers API resource"""

    def __init__(self, client: "PexipayClient"):
        self.client = client

    def create(
        self,
        email: str,
        name: Optional[str] = None,
        phone: Optional[str] = None,
        address: Optional[Dict[str, str]] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Create a new customer"""
        data = {
            "email": email,
            "name": name,
            "phone": phone,
            "address": address,
            "metadata": metadata,
        }
        # Remove None values
        data = {k: v for k, v in data.items() if v is not None}

        response = self.client.request("POST", "/customers", data=data)
        return response.get("data", response)

    def retrieve(self, customer_id: str) -> Dict[str, Any]:
        """Retrieve a customer by ID"""
        response = self.client.request("GET", f"/customers/{customer_id}")
        return response.get("data", response)

    def update(
        self,
        customer_id: str,
        email: Optional[str] = None,
        name: Optional[str] = None,
        phone: Optional[str] = None,
        address: Optional[Dict[str, str]] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Update a customer"""
        data = {
            "email": email,
            "name": name,
            "phone": phone,
            "address": address,
            "metadata": metadata,
        }
        # Remove None values
        data = {k: v for k, v in data.items() if v is not None}

        response = self.client.request("PATCH", f"/customers/{customer_id}", data=data)
        return response.get("data", response)

    def delete(self, customer_id: str) -> Dict[str, Any]:
        """Delete a customer"""
        return self.client.request("DELETE", f"/customers/{customer_id}")

    def list(
        self,
        limit: Optional[int] = None,
        starting_after: Optional[str] = None,
        ending_before: Optional[str] = None,
        email: Optional[str] = None,
        created_after: Optional[str] = None,
        created_before: Optional[str] = None,
    ) -> Dict[str, Any]:
        """List customers"""
        params = {
            "limit": limit,
            "startingAfter": starting_after,
            "endingBefore": ending_before,
            "email": email,
            "createdAfter": created_after,
            "createdBefore": created_before,
        }
        # Remove None values
        params = {k: v for k, v in params.items() if v is not None}

        return self.client.request("GET", "/customers", params=params)
