<?php

namespace Pexipay;

use GuzzleHttp\Client as HttpClient;
use GuzzleHttp\Exception\RequestException;
use Pexipay\Resources\Payments;
use Pexipay\Resources\PaymentLinks;
use Pexipay\Resources\Customers;
use Pexipay\Resources\Refunds;
use Pexipay\Resources\Transactions;
use Pexipay\Resources\Balance;
use Pexipay\Exceptions\PexipayException;

class PexipayClient
{
    private const VERSION = '1.0.0';
    private const API_ENDPOINTS = [
        'production' => 'https://api.pexipay.com/v1',
        'sandbox' => 'https://sandbox-api.pexipay.com/v1'
    ];

    private string $apiKey;
    private string $environment;
    private string $apiBaseUrl;
    private int $timeout;
    private int $maxRetries;
    private HttpClient $httpClient;

    public Payments $payments;
    public PaymentLinks $paymentLinks;
    public Customers $customers;
    public Refunds $refunds;
    public Transactions $transactions;
    public Balance $balance;

    public function __construct(array $config)
    {
        if (empty($config['api_key'])) {
            throw new \InvalidArgumentException(
                'API key is required. Get your API key from https://app.pexipay.com/dashboard/api-keys'
            );
        }

        $this->apiKey = $config['api_key'];
        $this->environment = $config['environment'] ?? 'production';
        $this->apiBaseUrl = $config['api_base_url'] ?? self::API_ENDPOINTS[$this->environment];
        $this->timeout = $config['timeout'] ?? 30;
        $this->maxRetries = $config['max_retries'] ?? 3;

        $this->httpClient = new HttpClient([
            'base_uri' => $this->apiBaseUrl,
            'timeout' => $this->timeout,
            'headers' => [
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
                'X-Pexipay-Version' => '2025-11-23',
                'User-Agent' => 'Pexipay-PHP-SDK/' . self::VERSION,
            ],
        ]);

        // Initialize resources
        $this->payments = new Payments($this);
        $this->paymentLinks = new PaymentLinks($this);
        $this->customers = new Customers($this);
        $this->refunds = new Refunds($this);
        $this->transactions = new Transactions($this);
        $this->balance = new Balance($this);
    }

    public function request(string $method, string $endpoint, array $options = []): array
    {
        $attempt = 0;
        
        while ($attempt < $this->maxRetries) {
            try {
                $response = $this->httpClient->request($method, $endpoint, $options);
                $body = (string) $response->getBody();
                return json_decode($body, true);
            } catch (RequestException $e) {
                $attempt++;
                
                $statusCode = $e->hasResponse() ? $e->getResponse()->getStatusCode() : 0;
                
                // Retry on 5xx errors
                if ($statusCode >= 500 && $attempt < $this->maxRetries) {
                    $delay = min(1000 * pow(2, $attempt - 1), 10000);
                    usleep($delay * 1000);
                    continue;
                }
                
                $this->handleError($e);
            }
        }
        
        throw new PexipayException('Max retries exceeded');
    }

    private function handleError(RequestException $e): void
    {
        $response = $e->getResponse();
        $statusCode = $response ? $response->getStatusCode() : 0;
        
        if ($response) {
            $body = json_decode((string) $response->getBody(), true);
            $message = $body['error'] ?? $body['message'] ?? $e->getMessage();
            $code = $body['code'] ?? null;
            $requestId = $body['requestId'] ?? null;
            $details = $body['details'] ?? null;
        } else {
            $message = $e->getMessage();
            $code = null;
            $requestId = null;
            $details = null;
        }

        throw new PexipayException($message, $statusCode, $code, $requestId, $details);
    }

    public function setApiKey(string $apiKey): void
    {
        $this->apiKey = $apiKey;
        $this->httpClient = new HttpClient([
            'base_uri' => $this->apiBaseUrl,
            'timeout' => $this->timeout,
            'headers' => [
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
                'X-Pexipay-Version' => '2025-11-23',
                'User-Agent' => 'Pexipay-PHP-SDK/' . self::VERSION,
            ],
        ]);
    }

    public function setEnvironment(string $environment): void
    {
        $this->environment = $environment;
        $this->apiBaseUrl = self::API_ENDPOINTS[$environment];
    }

    public function getHttpClient(): HttpClient
    {
        return $this->httpClient;
    }
}
