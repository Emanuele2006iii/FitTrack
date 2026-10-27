USE fit_track;

INSERT INTO users (username, email, password_hash) VALUES
    ('emanuele', 'emanuele@example.com', '$2y$12$TEt0InRr9ll8rVlFyR/EWumSWp/.dAZgVTuAaTwniOYtScgKDsjWq'),
    ('marco',    'marco@example.com',    '$2y$12$TEt0InRr9ll8rVlFyR/EWumSWp/.dAZgVTuAaTwniOYtScgKDsjWq'),
    ('giulia',   'giulia@example.com',   '$2y$12$TEt0InRr9ll8rVlFyR/EWumSWp/.dAZgVTuAaTwniOYtScgKDsjWq');

INSERT INTO training_sessions (user_id, activity_type, duration_minutes, session_date) VALUES
    (1, 'Corsa',     30, CURDATE() - INTERVAL 2 DAY),
    (1, 'Palestra',  60, CURDATE() - INTERVAL 1 DAY),
    (1, 'Yoga',      45, CURDATE()),
    (2, 'Camminata', 40, CURDATE() - INTERVAL 1 DAY);
