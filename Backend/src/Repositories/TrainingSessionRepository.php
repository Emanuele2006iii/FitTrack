<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\TrainingSession;

use PDO;

final class TrainingSessionRepository
{
    private const COLUMNS = 'id, user_id, activity_type, duration_minutes, session_date';

    public function __construct(private readonly PDO $pdo) {}

    public function findByUser(int $userId): array {
        $stmt = $this->pdo->prepare(
            'SELECT ' . self::COLUMNS . ' FROM training_sessions
            WHERE user_id = :user_id
            ORDER BY session_date DESC, id DESC'
        );
        $stmt->execute(['user_id' => $userId]);

        return array_map([TrainingSession::class, 'fromRow'], $stmt->fetchAll());
    }

    public function findById(int $id): ?TrainingSession
    {
        $stmt = $this->pdo->prepare('SELECT ' . self::COLUMNS . ' FROM training_sessions WHERE id = :id');
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();

        return $row === false ? null : TrainingSession::fromRow($row);
    }

    public function create(int $userId, string $activityType, int $durationMinutes, string $sessionDate): TrainingSession {
        $stmt = $this->pdo->prepare(
        'INSERT INTO training_sessions (user_id, activity_type, duration_minutes, session_date)
                VALUES (:user_id, :activity_type, :duration_minutes, :session_date)'
        );
        $stmt->execute([
            'user_id' => $userId,
            'activity_type' => $activityType,
            'duration_minutes' => $durationMinutes,
            'session_date' => $sessionDate,
        ]);

        return $this->findById((int) $this->pdo->lastInsertId());
    }

    public function delete(int $id): void
    {
        $stmt = $this->pdo->prepare('DELETE FROM training_sessions WHERE id = :id');
        $stmt->execute(['id' => $id]);
    }
}
