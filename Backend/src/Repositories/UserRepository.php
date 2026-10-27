<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\User;
use PDO;

final class UserRepository
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function findById(int $id): ?User
    {
        $statement = $this->pdo->prepare('SELECT * FROM users WHERE id = :id');
        $statement->execute(['id' => $id]);
        $row = $statement->fetch();

        return $row === false ? null : User::fromRow($row);
    }

    public function findByUsername(string $username): ?User
    {
        $statement = $this->pdo->prepare('SELECT * FROM users WHERE username = :username');
        $statement->execute(['username' => $username]);
        $row = $statement->fetch();

        return $row === false ? null : User::fromRow($row);
    }
    public function existsByUsernameOrEmail(string $username, string $email): bool
    {
        $statement = $this->pdo->prepare('SELECT 1 FROM users WHERE username = :username OR email = :email');
        $statement->execute(['username' => $username, 'email' => $email]);

        return $statement->fetchColumn() !== false;
    }

    public function create(string $username, string $email, string $passwordHash): User
    {
        $statement = $this->pdo->prepare(
            'INSERT INTO users (username, email, password_hash) VALUES (:username, :email, :password_hash)'
        );
        $statement->execute(['username' => $username, 'email' => $email, 'password_hash' => $passwordHash]);

        return $this->findById((int) $this->pdo->lastInsertId());
    }
}
