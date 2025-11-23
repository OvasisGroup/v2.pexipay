<?php

namespace Pexipay\Resources;

use Pexipay\PexipayClient;

class Balance
{
    private PexipayClient $client;

    public function __construct(PexipayClient $client)
    {
        $this->client = $client;
    }

    public function retrieve(): array
    {
        $response = $this->client->request('GET', '/balance');
        return $response['data'] ?? $response;
    }

    public function listTransactions(array $params = []): array
    {
        return $this->client->request('GET', '/balance/transactions', [
            'query' => $params
        ]);
    }
}
