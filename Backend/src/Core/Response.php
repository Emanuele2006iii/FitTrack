<?php

declare(strict_types=1);

namespace App\Core;
final class Response
{
    public static function json(int $status, mixed $data): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['data' => $data], JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    }

    public static function error(int $status, string $message): void
    {
        http_response_code($status);

        if ($status === 401) {
            header('WWW-Authenticate: Bearer realm="fit-track"');
        }
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['error' => $message], JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    }

    public static function noContent(): void
    {
        http_response_code(204);
    }
}
