<?php

namespace Pexipay;

class Webhook
{
    /**
     * Verify webhook signature from Pexipay
     */
    public static function verifySignature(string $payload, string $signature, string $webhookSecret): bool
    {
        $expectedSignature = hash_hmac('sha256', $payload, $webhookSecret);
        return hash_equals($signature, $expectedSignature);
    }

    /**
     * Parse and verify webhook event
     */
    public static function constructEvent(string $payload, string $signature, string $webhookSecret): array
    {
        if (!self::verifySignature($payload, $signature, $webhookSecret)) {
            throw new \InvalidArgumentException('Invalid webhook signature');
        }

        return json_decode($payload, true);
    }
}
