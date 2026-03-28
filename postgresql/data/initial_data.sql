INSERT INTO fitness_tracker.exercises(name, muscle_group, calories_per_minute, description)
VALUES
    ('Push-ups', 'Chest', 8, 'Classic bodyweight push exercise'),
    ('Running', 'Cardio', 10, 'Steady-state cardio session')
ON CONFLICT (name, muscle_group)
DO NOTHING;
