<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Services\AuthService;

final class AuthController
{
    public function __construct(private readonly AuthService $auth)
    {
    }
    public function register(Request $request): void
    {
        $user = $this->auth->register(
            $request->string('username'),
            $request->string('email'),
            $request->string('password')
        );

        Response::json(201, $user);
    }
    public function login(Request $request): void
    {
        $result = $this->auth->login($request->string('username'), $request->string('password'));

        Response::json(200, $result);
    }
    public function me(Request $request): void
    {
        Response::json(200, $this->auth->authenticate($request->bearerToken()));
    }
}
