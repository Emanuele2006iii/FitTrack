<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Services\AuthService;
use App\Services\TrainingSessionService;
final class TrainingSessionController
{
    public function __construct(
        private readonly TrainingSessionService $sessions,
        private readonly AuthService $auth
    ) {}
    public function index(Request $request): void
    {
        $user = $this->auth->authenticate($request->bearerToken());

        Response::json(200, $this->sessions->listFor($user));
    }
    public function store(Request $request): void
    {
        $user = $this->auth->authenticate($request->bearerToken());

        Response::json(201, $this->sessions->create(
            $user,
            $request->string('activityType'),
            $request->int('durationMinutes'),
            $request->string('sessionDate')
        ));
    }
    public function destroy(Request $request): void
    {
        $user = $this->auth->authenticate($request->bearerToken());
        $this->sessions->delete($user, (int) $request->params['id']);

        Response::noContent();
    }
}
