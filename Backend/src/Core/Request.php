<?php

declare(strict_types=1);

namespace App\Core;
final class Request
{
    public array $params = [];

    private function __construct(
        public readonly string $method,
        public readonly string $path,
        private readonly string $rawBody,
        private readonly ?string $authorization
    ) {}

    public static function fromGlobals(): self
    {
        $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';

        return new self(
            strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET'),
            rtrim($path, '/') ?: '/',
            (string) file_get_contents('php://input'),
            $_SERVER['HTTP_AUTHORIZATION'] ?? null
        );
    }

    public function json(): array
    {
        if ($this->rawBody === '') {
            return [];
        }

        $data = json_decode($this->rawBody, true);
        if (!is_array($data)) {
            throw new HttpException(400, 'Il corpo della richiesta non è JSON valido');
        }

        return $data;
    }

    public function string(string $key): string
    {
        $value = $this->json()[$key] ?? '';
        if (!is_string($value)) {
            throw new HttpException(422, "Il campo $key deve essere un testo");
        }

        return $value;
    }

    public function int(string $key): int
    {
        $value = $this->json()[$key] ?? null;
        if (!is_int($value)) {
            throw new HttpException(422, "Il campo $key deve essere un numero intero");
        }

        return $value;
    }
    public function bearerToken(): ?string
    {
        if ($this->authorization !== null && preg_match('/^Bearer\s+(\S+)$/i', $this->authorization, $match)) {
            return $match[1];
        }

        return null;
    }
}
