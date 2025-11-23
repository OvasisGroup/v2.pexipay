<?php

namespace Pexipay\Resources;

use Pexipay\PexipayClient;

class Refunds
{
    private PexipayClient $client;

    public function __construct(PexipayClient $client)
    {
        $this->client = $client;
    }

    public function create(array $params): array
    {
        $response = $this->client->request('POST', '/refunds', [
            'json' => $params
        ]);
        return $response['data'] ?? $response;
    }

    public function retrieve(string $refundId): array
    {
        $response = $this->client->request('GET', "/refunds/{$refundId}");
        return $response['data'] ?? $response;
    }

    public function list(array $params = []): array
    {
        return $this->client->request('GET', '/refunds', [
            'query' => $params
        ]);
    }

    public function cancel(string $refundId): array
    {
        $response = $this->client->request('POST', "/refunds/{$refundId}/cancel");
        return $response['data'] ?? $response;
    }
}
