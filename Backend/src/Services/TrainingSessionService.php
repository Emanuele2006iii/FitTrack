<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\HttpException;
use App\Models\TrainingSession;
use App\Models\User;
use App\Repositories\TrainingSessionRepository;
final class TrainingSessionService
{
    public function __construct(private readonly TrainingSessionRepository $sessions)
    {
    }

    public function listFor(User $user): array
    {
        return $this->sessions->findByUser($user->id);
    }

    public function create(User $user, string $activityType, int $durationMinutes, string $sessionDate): TrainingSession
    {
        $activityType = trim($activityType);

        if ($activityType === '' || mb_strlen($activityType) > 50) {
            throw new HttpException(422, 'Il tipo di attività deve avere da 1 a 50 caratteri');
        }
        if ($durationMinutes < 1 || $durationMinutes > 1440) {
            throw new HttpException(422, 'La durata deve essere fra 1 e 1440 minuti');
        }

        $date = \DateTime::createFromFormat('Y-m-d', $sessionDate);
        if ($date === false || $date->format('Y-m-d') !== $sessionDate) {
            throw new HttpException(422, 'La data deve essere nel formato AAAA-MM-GG');
        }
        if ($sessionDate > date('Y-m-d')) {
            throw new HttpException(422, 'La data non può essere nel futuro');
        }

        return $this->sessions->create($user->id, $activityType, $durationMinutes, $sessionDate);
    }
    public function delete(User $user, int $id): void
    {
        $session = $this->sessions->findById($id);

        if ($session === null) {
            throw new HttpException(404, 'Allenamento non trovato');
        }
        if ($session->userId !== $user->id) {
            throw new HttpException(403, 'Puoi cancellare solo i tuoi allenamenti');
        }

        $this->sessions->delete($id);
    }
}
