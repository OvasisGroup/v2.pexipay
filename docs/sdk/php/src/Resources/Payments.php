<?php

namespace Pexipay\Resources;

use Pexipay\PexipayClient;

class Payments
{
    private PexipayClient $client;

    public function __construct(PexipayClient $client)
    {
        $this->client = $client;
    }

    public function create(array $params): array
    {
        $response = $this->client->request('POST', '/payments', [
            'json' => $params
        ]);
        return $response['data'] ?? $response;
    }

    public function retrieve(string $paymentId): array
    {
        $response = $this->client->request('GET', "/payments/{$paymentId}");
        return $response['data'] ?? $response;
    }

    public function list(array $params = []): array
    {
        return $this->client->request('GET', '/payments', [
            'query' => $params
        ]);
    }

    public function confirm3DS(string $paymentId, string $threeDSResult): array
    {
        $response = $this->client->request('POST', "/payments/{$paymentId}/3ds/confirm", [
            'json' => ['threeDSResult' => $threeDSResult]
        ]);
        return $response['data'] ?? $response;
    }

    public function cancel(string $paymentId): array
    {
        $response = $this->client->request('POST', "/payments/{$paymentId}/cancel");
        return $response['data'] ?? $response;
    }

    public function capture(string $paymentId, ?float $amount = null): array
    {
        $data = $amount !== null ? ['amount' => $amount] : [];
        $response = $this->client->request('POST', "/payments/{$paymentId}/capture", [
            'json' => $data
        ]);
        return $response['data'] ?? $response;
    }
}
