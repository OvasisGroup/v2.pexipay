<?php

namespace Pexipay\Resources;

use Pexipay\PexipayClient;

class Customers
{
    private PexipayClient $client;

    public function __construct(PexipayClient $client)
    {
        $this->client = $client;
    }

    public function create(array $params): array
    {
        $response = $this->client->request('POST', '/customers', [
            'json' => $params
        ]);
        return $response['data'] ?? $response;
    }

    public function retrieve(string $customerId): array
    {
        $response = $this->client->request('GET', "/customers/{$customerId}");
        return $response['data'] ?? $response;
    }

    public function update(string $customerId, array $params): array
    {
        $response = $this->client->request('PATCH', "/customers/{$customerId}", [
            'json' => $params
        ]);
        return $response['data'] ?? $response;
    }

    public function delete(string $customerId): array
    {
        return $this->client->request('DELETE', "/customers/{$customerId}");
    }

    public function list(array $params = []): array
    {
        return $this->client->request('GET', '/customers', [
            'query' => $params
        ]);
    }
}
