<?php

declare(strict_types=1);

namespace App\Models;

use JsonSerializable;
final class TrainingSession implements JsonSerializable
{
    public function __construct(
        public readonly int $id,
        public readonly int $userId,
        public readonly string $activityType,
        public readonly int $durationMinutes,
        public readonly string $sessionDate
    ) {}
    public static function fromRow(array $row): self
    {
        return new self(
            (int) $row['id'],
            (int) $row['user_id'],
            $row['activity_type'],
            (int) $row['duration_minutes'],
            $row['session_date']
        );
    }
    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'activityType' => $this->activityType,
            'durationMinutes' => $this->durationMinutes,
            'sessionDate' => $this->sessionDate,
        ];
    }
}
