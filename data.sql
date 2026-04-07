TRUNCATE TABLE
    fitness_tracker.workout_exercises,
    fitness_tracker.workouts,
    fitness_tracker.sessions,
    fitness_tracker.exercises,
    fitness_tracker.users
RESTART IDENTITY CASCADE;

INSERT INTO fitness_tracker.users (id, login, first_name, last_name, password_salt, password_hash)
VALUES
    (1, 'athlete01', 'Kirill', 'Palatkin', 'salt01', 'hash01'),
    (2, 'athlete02', 'Ivan', 'Petrov', 'salt02', 'hash02'),
    (3, 'athlete03', 'Anna', 'Smirnova', 'salt03', 'hash03'),
    (4, 'athlete04', 'Pavel', 'Sidorov', 'salt04', 'hash04'),
    (5, 'athlete05', 'Maria', 'Kuznetsova', 'salt05', 'hash05'),
    (6, 'athlete06', 'Oleg', 'Volkov', 'salt06', 'hash06'),
    (7, 'athlete07', 'Elena', 'Orlova', 'salt07', 'hash07'),
    (8, 'athlete08', 'Dmitry', 'Fedorov', 'salt08', 'hash08'),
    (9, 'athlete09', 'Sofia', 'Morozova', 'salt09', 'hash09'),
    (10, 'athlete10', 'Nikita', 'Alekseev', 'salt10', 'hash10');

INSERT INTO fitness_tracker.sessions (token, user_id, expires_at)
VALUES
    ('token-athlete01', 1, NOW() + INTERVAL '7 days'),
    ('token-athlete02', 2, NOW() + INTERVAL '7 days'),
    ('token-athlete03', 3, NOW() + INTERVAL '7 days'),
    ('token-athlete04', 4, NOW() + INTERVAL '7 days'),
    ('token-athlete05', 5, NOW() + INTERVAL '7 days'),
    ('token-athlete06', 6, NOW() + INTERVAL '7 days'),
    ('token-athlete07', 7, NOW() + INTERVAL '7 days'),
    ('token-athlete08', 8, NOW() + INTERVAL '7 days'),
    ('token-athlete09', 9, NOW() + INTERVAL '7 days'),
    ('token-athlete10', 10, NOW() + INTERVAL '7 days');

INSERT INTO fitness_tracker.exercises (id, name, muscle_group, calories_per_minute, description, created_by)
VALUES
    (1, 'Push-ups', 'Chest', 8, 'Classic bodyweight push exercise', 1),
    (2, 'Running', 'Cardio', 10, 'Steady-state cardio session', 2),
    (3, 'Squats', 'Legs', 9, 'Lower body strength exercise', 3),
    (4, 'Plank', 'Core', 5, 'Static core stability exercise', 4),
    (5, 'Burpees', 'Cardio', 12, 'Explosive full body exercise', 5),
    (6, 'Pull-ups', 'Back', 9, 'Upper body pulling exercise', 6),
    (7, 'Lunges', 'Legs', 8, 'Single-leg lower body exercise', 7),
    (8, 'Mountain Climbers', 'Core', 11, 'Dynamic core and cardio movement', 8),
    (9, 'Jump Rope', 'Cardio', 13, 'Rope skipping cardio exercise', 9),
    (10, 'Bench Dips', 'Triceps', 7, 'Bodyweight triceps exercise', 10);

INSERT INTO fitness_tracker.workouts (id, user_id, title, planned_date, notes)
VALUES
    (1, 1, 'Morning Power', DATE '2026-03-01', 'Chest and core focus'),
    (2, 2, 'Park Run', DATE '2026-03-03', 'Cardio session in the park'),
    (3, 3, 'Leg Day', DATE '2026-03-05', 'Lower body strength'),
    (4, 4, 'Core Control', DATE '2026-03-07', 'Stability and posture'),
    (5, 5, 'HIIT Blast', DATE '2026-03-10', 'Short intense intervals'),
    (6, 6, 'Back Builder', DATE '2026-03-12', 'Upper back strength'),
    (7, 7, 'Functional Legs', DATE '2026-03-15', 'Balance and coordination'),
    (8, 8, 'Fast Core', DATE '2026-03-18', 'Core endurance'),
    (9, 9, 'Rope Session', DATE '2026-03-21', 'Cardio with jump rope'),
    (10, 10, 'Arm Finish', DATE '2026-03-25', 'Accessory upper body');

INSERT INTO fitness_tracker.workout_exercises (id, workout_id, exercise_id, sets, reps, duration_minutes, position)
VALUES
    (1, 1, 1, 4, 15, 20, 1),
    (2, 2, 2, 1, 1, 30, 1),
    (3, 3, 3, 5, 12, 25, 1),
    (4, 4, 4, 3, 1, 15, 1),
    (5, 5, 5, 4, 10, 18, 1),
    (6, 6, 6, 4, 8, 22, 1),
    (7, 7, 7, 4, 12, 20, 1),
    (8, 8, 8, 3, 20, 16, 1),
    (9, 9, 9, 1, 1, 25, 1),
    (10, 10, 10, 4, 15, 18, 1);

SELECT setval('fitness_tracker.users_id_seq', (SELECT MAX(id) FROM fitness_tracker.users));
SELECT setval('fitness_tracker.exercises_id_seq', (SELECT MAX(id) FROM fitness_tracker.exercises));
SELECT setval('fitness_tracker.workouts_id_seq', (SELECT MAX(id) FROM fitness_tracker.workouts));
SELECT setval('fitness_tracker.workout_exercises_id_seq', (SELECT MAX(id) FROM fitness_tracker.workout_exercises));
