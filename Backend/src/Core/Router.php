<?php

declare(strict_types=1);

namespace App\Core;

final class Router
{
    private array $routes = [];

    public function add(string $method, string $pattern, callable $handler): void
    {
        $regex = '#^' . preg_replace('/\{(\w+)\}/', '(?P<$1>[0-9]+)', $pattern) . '$#';
        $this->routes[] = ['method' => $method, 'regex' => $regex, 'handler' => $handler];
    }

    public function dispatch(Request $request): void
    {
        $pathFound = false;

        foreach ($this->routes as $route) {
            if (!preg_match($route['regex'], $request->path, $match)) {
                continue;
            }
            $pathFound = true;

            if ($route['method'] === $request->method) {
                $request->params = array_filter($match, 'is_string', ARRAY_FILTER_USE_KEY);
                ($route['handler'])($request);
                return;
            }
        }

        throw $pathFound
            ? new HttpException(405, 'Metodo non consentito su questo percorso')
            : new HttpException(404, 'Percorso non trovato');
    }
}
