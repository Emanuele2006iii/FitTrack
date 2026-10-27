<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\HttpException;
use App\Models\User;
use App\Repositories\UserRepository;
final class AuthService
{
    public function __construct(
        private readonly UserRepository $users,
        private readonly TokenService $tokens
    ) {
    }

    public function register(string $username, string $email, string $password): User
    {
        $username = trim($username);
        $email = trim($email);

        if (!preg_match('/^[A-Za-z0-9_]{3,30}$/', $username)) {
            throw new HttpException(422, 'Lo username deve avere da 3 a 30 caratteri: lettere, numeri o _');
        }
        if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            throw new HttpException(422, 'Email non valida');
        }
        if (mb_strlen($password) < 8) {
            throw new HttpException(422, 'La password deve avere almeno 8 caratteri');
        }
        if ($this->users->existsByUsernameOrEmail($username, $email)) {
            throw new HttpException(409, 'Username o email già registrati');
        }

        return $this->users->create($username, $email, password_hash($password, PASSWORD_DEFAULT));
    }

    public function login(string $username, string $password): array
    {
        $user = $this->users->findByUsername(trim($username));

        if ($user === null || !password_verify($password, $user->passwordHash)) {
            throw new HttpException(401, 'Username o password errati');
        }

        return ['token' => $this->tokens->generate($user->id), 'user' => $user];
    }

    public function authenticate(?string $token): User
    {
        if ($token === null) {
            throw new HttpException(401, 'Token mancante');
        }

        $userId = $this->tokens->userIdFrom($token);
        $user = $userId === null ? null : $this->users->findById($userId);

        if ($user === null) {
            throw new HttpException(401, 'Token non valido o scaduto');
        }

        return $user;
    }
}
