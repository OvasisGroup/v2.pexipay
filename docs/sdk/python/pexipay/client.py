"""Pexipay Client"""

from typing import Optional, Dict, Any
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

from .resources.payments import PaymentsResource
from .resources.payment_links import PaymentLinksResource
from .resources.customers import CustomersResource
from .resources.refunds import RefundsResource
from .resources.transactions import TransactionsResource
from .resources.balance import BalanceResource
from .errors import PexipayError


DEFAULT_API_ENDPOINTS = {
    "production": "https://api.pexipay.com/v1",
    "sandbox": "https://sandbox-api.pexipay.com/v1",
}


class PexipayClient:
    """Pexipay API client"""

    def __init__(
        self,
        api_key: str,
        environment: str = "production",
        api_base_url: Optional[str] = None,
        timeout: int = 30,
        max_retries: int = 3,
    ):
        """
        Initialize Pexipay client

        Args:
            api_key: Your Pexipay API key
            environment: 'production' or 'sandbox'
            api_base_url: Custom API base URL (overrides environment)
            timeout: Request timeout in seconds
            max_retries: Maximum number of retry attempts
        """
        if not api_key:
            raise ValueError(
                "API key is required. Get your API key from "
                "https://app.pexipay.com/dashboard/api-keys"
            )

        self.api_key = api_key
        self.environment = environment
        self.api_base_url = api_base_url or DEFAULT_API_ENDPOINTS[environment]
        self.timeout = timeout
        self.max_retries = max_retries

        # Create session with retry logic
        self.session = requests.Session()
        retry_strategy = Retry(
            total=max_retries,
            backoff_factor=1,
            status_forcelist=[500, 502, 503, 504],
            allowed_methods=["GET", "POST", "PATCH", "DELETE"],
        )
        adapter = HTTPAdapter(max_retries=retry_strategy)
        self.session.mount("http://", adapter)
        self.session.mount("https://", adapter)

        # Set default headers
        self.session.headers.update(
            {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "X-Pexipay-Version": "2025-11-23",
                "User-Agent": "Pexipay-Python-SDK/1.0.0",
            }
        )

        # Initialize resources
        self.payments = PaymentsResource(self)
        self.payment_links = PaymentLinksResource(self)
        self.customers = CustomersResource(self)
        self.refunds = RefundsResource(self)
        self.transactions = TransactionsResource(self)
        self.balance = BalanceResource(self)

    def request(
        self,
        method: str,
        endpoint: str,
        params: Optional[Dict[str, Any]] = None,
        data: Optional[Dict[str, Any]] = None,
        headers: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """Make HTTP request to Pexipay API"""
        url = f"{self.api_base_url}{endpoint}"

        request_headers = self.session.headers.copy()
        if headers:
            request_headers.update(headers)

        try:
            response = self.session.request(
                method=method,
                url=url,
                params=params,
                json=data,
                headers=request_headers,
                timeout=self.timeout,
            )

            if not response.ok:
                error_data = response.json() if response.content else {}
                raise PexipayError(
                    message=error_data.get("error") or error_data.get("message") or response.text,
                    status_code=response.status_code,
                    code=error_data.get("code"),
                    request_id=error_data.get("requestId"),
                    details=error_data.get("details"),
                )

            return response.json()

        except requests.exceptions.RequestException as e:
            raise PexipayError(f"Network error: {str(e)}")

    def set_api_key(self, api_key: str) -> None:
        """Update the API key"""
        self.api_key = api_key
        self.session.headers.update({"Authorization": f"Bearer {api_key}"})

    def set_environment(self, environment: str) -> None:
        """Switch environment"""
        self.environment = environment
        self.api_base_url = DEFAULT_API_ENDPOINTS[environment]
