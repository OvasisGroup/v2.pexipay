<?php

namespace Pexipay\Resources;

use Pexipay\PexipayClient;

class Transactions
{
    private PexipayClient $client;

    public function __construct(PexipayClient $client)
    {
        $this->client = $client;
    }

    public function retrieve(string $transactionId): array
    {
        $response = $this->client->request('GET', "/transactions/{$transactionId}");
        return $response['data'] ?? $response;
    }

    public function list(array $params = []): array
    {
        return $this->client->request('GET', '/transactions', [
            'query' => $params
        ]);
    }
}
