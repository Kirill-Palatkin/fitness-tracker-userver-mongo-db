PREPARE register_user(text, text, text, text, text) AS
INSERT INTO fitness_tracker.users (login, first_name, last_name, password_salt, password_hash)
VALUES ($1, $2, $3, $4, $5)
RETURNING id, login, first_name, last_name;

PREPARE login_user(text) AS
SELECT id, login, first_name, last_name, password_salt, password_hash
FROM fitness_tracker.users
WHERE login = $1;

PREPARE create_session(bigint, text) AS
INSERT INTO fitness_tracker.sessions (user_id, token, expires_at)
VALUES ($1, $2, NOW() + INTERVAL '7 days')
RETURNING token, user_id, expires_at;

PREPARE get_user_by_login(text) AS
SELECT id, login, first_name, last_name
FROM fitness_tracker.users
WHERE login = $1;

PREPARE search_users(text) AS
SELECT id, login, first_name, last_name
FROM fitness_tracker.users
WHERE first_name ILIKE $1
   OR last_name ILIKE $1
   OR (first_name || ' ' || last_name) ILIKE $1
ORDER BY last_name, first_name
LIMIT 20;

PREPARE list_exercises AS
SELECT id, name, muscle_group, calories_per_minute, description, created_by
FROM fitness_tracker.exercises
ORDER BY name, id;

PREPARE create_exercise(text, text, integer, text, bigint) AS
INSERT INTO fitness_tracker.exercises (name, muscle_group, calories_per_minute, description, created_by)
VALUES ($1, $2, $3, $4, $5)
RETURNING id, name, muscle_group, calories_per_minute, description, created_by;

PREPARE create_workout(bigint, text, date, text) AS
INSERT INTO fitness_tracker.workouts (user_id, title, planned_date, notes)
VALUES ($1, $2, $3, $4)
RETURNING id, user_id, title, planned_date, notes;

PREPARE add_workout_exercise(bigint, bigint, integer, integer, integer) AS
INSERT INTO fitness_tracker.workout_exercises (workout_id, exercise_id, sets, reps, duration_minutes, position)
VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    COALESCE(
        (SELECT MAX(position) + 1
         FROM fitness_tracker.workout_exercises
         WHERE workout_id = $1),
        1
    )
)
RETURNING id, workout_id, exercise_id, sets, reps, duration_minutes;

PREPARE get_workout_history(bigint, date, date) AS
SELECT id, title, planned_date, notes
FROM fitness_tracker.workouts
WHERE user_id = $1
  AND planned_date BETWEEN $2 AND $3
ORDER BY planned_date DESC, id DESC;

PREPARE get_workout_entries(bigint) AS
SELECT
    we.id,
    we.workout_id,
    e.id AS exercise_id,
    e.name,
    e.muscle_group,
    we.sets,
    we.reps,
    we.duration_minutes,
    ROUND((we.duration_minutes * e.calories_per_minute)::numeric, 2)::double precision AS calories_burned
FROM fitness_tracker.workout_exercises we
JOIN fitness_tracker.exercises e ON e.id = we.exercise_id
WHERE we.workout_id = $1
ORDER BY we.position, we.id;

PREPARE get_workout_statistics(bigint, date, date) AS
SELECT
    COUNT(DISTINCT w.id) AS workout_count,
    COUNT(we.id) AS exercise_entries_count,
    COALESCE(SUM(we.duration_minutes), 0) AS total_minutes,
    COALESCE(ROUND(SUM(we.duration_minutes * e.calories_per_minute)::numeric, 2), 0)::double precision AS total_calories
FROM fitness_tracker.workouts w
LEFT JOIN fitness_tracker.workout_exercises we ON we.workout_id = w.id
LEFT JOIN fitness_tracker.exercises e ON e.id = we.exercise_id
WHERE w.user_id = $1
  AND w.planned_date BETWEEN $2 AND $3;

PREPARE get_active_session(text) AS
SELECT u.id, u.login, u.first_name, u.last_name
FROM fitness_tracker.sessions s
JOIN fitness_tracker.users u ON u.id = s.user_id
WHERE s.token = $1
  AND s.expires_at > NOW();
