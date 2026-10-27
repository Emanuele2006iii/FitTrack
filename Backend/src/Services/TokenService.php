<?php

declare(strict_types=1);

namespace App\Services;

use RuntimeException;

final class TokenService
{
    private const LIFETIME_SECONDS = 3600;

    public function __construct(private readonly string $secret)
    {
        if ($secret === '') {
            throw new RuntimeException('TOKEN_SECRET mancante');
        }
    }

    public function generate(int $userId): string
    {
        $payload = base64_encode(json_encode([
            'id' => $userId,
            'exp' => time() + self::LIFETIME_SECONDS,
        ]));
        $signature = hash_hmac('sha512', $payload, $this->secret);

        return $signature . '.' . $payload;
    }

    public function userIdFrom(string $token): ?int
    {
        $parts = explode('.', $token);
        if (count($parts) !== 2) {
            return null;
        }

        [$signature, $payload] = $parts;
        if (!hash_equals(hash_hmac('sha512', $payload, $this->secret), $signature)) {
            return null;
        }

        $data = json_decode(base64_decode($payload), true);
        if (!is_array($data) || !isset($data['id'], $data['exp']) || $data['exp'] < time()) {
            return null;
        }

        return (int) $data['id'];
    }
}
