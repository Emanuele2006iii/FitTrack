<?php

declare(strict_types=1);

namespace App\Models;

use JsonSerializable;

final class User implements JsonSerializable
{
    public function __construct(
        public readonly int $id,
        public readonly string $username,
        public readonly string $email,
        public readonly string $passwordHash,
        public readonly string $createdAt
    ) {}
    public static function fromRow(array $row): self
    {
        return new self(
            (int) $row['id'],
            $row['username'],
            $row['email'],
            $row['password_hash'],
            $row['created_at']
        );
    }
    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'username' => $this->username,
            'email' => $this->email,
            'createdAt' => self::toIso8601($this->createdAt),
        ];
    }
    private static function toIso8601(string $mysqlDate): string
    {
        return str_replace(' ', 'T', $mysqlDate) . 'Z';
    }
}
