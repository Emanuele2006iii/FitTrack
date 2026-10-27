<?php

declare(strict_types=1);


use App\Core\Database;
use App\Core\HttpException;
use App\Core\Request;
use App\Core\Response;
use App\Core\Router;
use App\Repositories\UserRepository;
use App\Repositories\TrainingSessionRepository;
use App\Services\AuthService;
use App\Services\TokenService;
use App\Services\TrainingSessionService;
use App\Controllers\AuthController;
use App\Controllers\TrainingSessionController;



spl_autoload_register(function (string $class): void {
    $prefix = 'App\\';
    if (str_starts_with($class, $prefix)) {
        $file = __DIR__ . '/../src/' . str_replace('\\', '/', substr($class, strlen($prefix))) . '.php';
        if (is_file($file)) {
            require $file;
        }
    }
});

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

try {
    $pdo = Database::getConnection();
    $authService = new AuthService(new UserRepository($pdo), new TokenService((string) getenv('TOKEN_SECRET')));
    $authController = new AuthController($authService);
    $sessionService = new TrainingSessionService(new TrainingSessionRepository($pdo));
    $sessionController = new TrainingSessionController($sessionService, $authService);

    $router = new Router();
    $router->add('POST', '/api/register', [$authController, 'register']);
    $router->add('POST', '/api/login', [$authController, 'login']);
    $router->add('GET', '/api/me', [$authController, 'me']);
    $router->add('GET', '/api/training-sessions', [$sessionController, 'index']);
    $router->add('POST', '/api/training-sessions', [$sessionController, 'store']);
    $router->add('DELETE', '/api/training-sessions/{id}', [$sessionController, 'destroy']);

    $router->dispatch(Request::fromGlobals());
} catch (HttpException $exception) {
    Response::error($exception->status, $exception->getMessage());
} catch (Throwable $exception) {
    error_log((string) $exception);
    Response::error(500, 'Errore interno del server');
}
