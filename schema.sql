DROP SCHEMA IF EXISTS fitness_tracker CASCADE;

CREATE SCHEMA fitness_tracker;

CREATE TABLE fitness_tracker.users (
    id BIGSERIAL PRIMARY KEY,
    login TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE fitness_tracker.sessions (
    token TEXT PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES fitness_tracker.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE fitness_tracker.exercises (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    muscle_group TEXT NOT NULL,
    calories_per_minute INTEGER NOT NULL CHECK (calories_per_minute > 0),
    description TEXT NOT NULL DEFAULT '',
    created_by BIGINT REFERENCES fitness_tracker.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (name, muscle_group)
);

CREATE TABLE fitness_tracker.workouts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES fitness_tracker.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    planned_date DATE NOT NULL,
    notes TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE fitness_tracker.workout_exercises (
    id BIGSERIAL PRIMARY KEY,
    workout_id BIGINT NOT NULL REFERENCES fitness_tracker.workouts(id) ON DELETE CASCADE,
    exercise_id BIGINT NOT NULL REFERENCES fitness_tracker.exercises(id) ON DELETE RESTRICT,
    sets INTEGER NOT NULL CHECK (sets > 0),
    reps INTEGER NOT NULL CHECK (reps > 0),
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    position INTEGER NOT NULL CHECK (position > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (workout_id, position)
);

CREATE INDEX idx_fitness_tracker_users_name
    ON fitness_tracker.users (last_name, first_name);

CREATE INDEX idx_fitness_tracker_sessions_user_id
    ON fitness_tracker.sessions (user_id);

CREATE INDEX idx_fitness_tracker_exercises_created_by
    ON fitness_tracker.exercises (created_by);

CREATE INDEX idx_fitness_tracker_workouts_user_date_id
    ON fitness_tracker.workouts (user_id, planned_date DESC, id DESC);

CREATE INDEX idx_fitness_tracker_workout_exercises_workout_position
    ON fitness_tracker.workout_exercises (workout_id, position, id);

CREATE INDEX idx_fitness_tracker_workout_exercises_exercise_id
    ON fitness_tracker.workout_exercises (exercise_id);
