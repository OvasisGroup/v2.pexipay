<?php

namespace Pexipay\Resources;

use Pexipay\PexipayClient;

class PaymentLinks
{
    private PexipayClient $client;

    public function __construct(PexipayClient $client)
    {
        $this->client = $client;
    }

    public function create(array $params): array
    {
        $response = $this->client->request('POST', '/payment-links', [
            'json' => $params
        ]);
        return $response['data'] ?? $response;
    }

    public function retrieve(string $paymentLinkId): array
    {
        $response = $this->client->request('GET', "/payment-links/{$paymentLinkId}");
        return $response['data'] ?? $response;
    }

    public function list(array $params = []): array
    {
        return $this->client->request('GET', '/payment-links', [
            'query' => $params
        ]);
    }

    public function cancel(string $paymentLinkId): array
    {
        $response = $this->client->request('POST', "/payment-links/{$paymentLinkId}/cancel");
        return $response['data'] ?? $response;
    }
}
