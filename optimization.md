# Оптимизация запросов

В проекте основной поток запросов связан с авторизацией, поиском пользователей, выборкой тренировок пользователя и построением статистики. Для этих операций в схеме добавлены отдельные индексы, помимо автоматически создаваемых индексов по PK и по уникальным ключам.

## Используемые индексы

`idx_fitness_tracker_users_name` ускоряет поиск и сортировку пользователей по фамилии и имени.

`idx_fitness_tracker_sessions_user_id` ускоряет соединения между `sessions` и `users`.
`idx_fitness_tracker_exercises_created_by` ускоряет выборки упражнений, созданных конкретным пользователем.

`idx_fitness_tracker_workouts_user_date_id` ускоряет получение истории тренировок и статистики по пользователю и диапазону дат.

`idx_fitness_tracker_workout_exercises_workout_position` ускоряет получение состава конкретной тренировки.

`idx_fitness_tracker_workout_exercises_exercise_id` ускоряет соединения `workout_exercises` и `exercises`.

## Оптимизация истории тренировок

Базовый запрос:

```sql
SELECT id, title, planned_date, notes
FROM fitness_tracker.workouts
WHERE user_id = $1
  AND planned_date BETWEEN $2 AND $3
ORDER BY planned_date DESC, id DESC;
```

До добавления составного индекса по `(user_id, planned_date DESC, id DESC)` PostgreSQL обычно должен читать больше строк таблицы `workouts`, а затем фильтровать их по пользователю и дате.

После добавления `idx_fitness_tracker_workouts_user_date_id` план запроса должен использовать индексный доступ по пользователю и диапазону дат, что уменьшает количество читаемых строк и уменьшает стоимость сортировки по `planned_date` и `id`.

Для проверки:

```sql
EXPLAIN
SELECT id, title, planned_date, notes
FROM fitness_tracker.workouts
WHERE user_id = 3
  AND planned_date BETWEEN DATE '2026-03-01' AND DATE '2026-03-31'
ORDER BY planned_date DESC, id DESC;
```

Фактический план до создания индекса:

```text
Sort
  Sort Key: planned_date DESC, id DESC
  ->  Seq Scan on workouts
        Filter: ((planned_date >= '2026-03-01'::date) AND (planned_date <= '2026-03-31'::date) AND (user_id = 3))
```

Фактический план после создания индекса:

```text
Index Scan using idx_fitness_tracker_workouts_user_date_id on workouts
  Index Cond: ((user_id = 3) AND (planned_date >= '2026-03-01'::date) AND (planned_date <= '2026-03-31'::date))
```

## Оптимизация получения упражнений внутри тренировки

Базовый запрос:

```sql
SELECT
    we.id,
    e.id AS exercise_id,
    e.name,
    e.muscle_group,
    we.sets,
    we.reps,
    we.duration_minutes
FROM fitness_tracker.workout_exercises we
JOIN fitness_tracker.exercises e ON e.id = we.exercise_id
WHERE we.workout_id = $1
ORDER BY we.position, we.id;
```

До добавления индекса по `workout_id` и `position` серверу приходится просматривать больше строк таблицы `workout_exercises` и отдельно упорядочивать результат.

После добавления `idx_fitness_tracker_workout_exercises_workout_position` выборка записей конкретной тренировки выполняется по индексу, а соединение с `exercises` использует первичный ключ таблицы `exercises`.

Для проверки:

```sql
EXPLAIN
SELECT
    we.id,
    e.id AS exercise_id,
    e.name,
    e.muscle_group,
    we.sets,
    we.reps,
    we.duration_minutes
FROM fitness_tracker.workout_exercises we
JOIN fitness_tracker.exercises e ON e.id = we.exercise_id
WHERE we.workout_id = 4
ORDER BY we.position, we.id;
```

Фактический план до создания индекса:

```text
Sort
  Sort Key: we.position, we.id
  ->  Hash Join
        Hash Cond: (e.id = we.exercise_id)
        ->  Seq Scan on exercises e
        ->  Hash
              ->  Bitmap Heap Scan on workout_exercises we
                    Recheck Cond: (workout_id = 4)
                    ->  Bitmap Index Scan on workout_exercises_workout_id_position_key
                          Index Cond: (workout_id = 4)
```

Фактический план после создания индекса:

```text
Sort
  Sort Key: we.position, we.id
  ->  Hash Join
        Hash Cond: (e.id = we.exercise_id)
        ->  Seq Scan on exercises e
        ->  Hash
              ->  Bitmap Heap Scan on workout_exercises we
                    Recheck Cond: (workout_id = 4)
                    ->  Bitmap Index Scan on idx_fitness_tracker_workout_exercises_workout_position
                          Index Cond: (workout_id = 4)
```

На небольшом тестовом наборе PostgreSQL все еще оставляет сортировку и последовательное чтение маленькой таблицы `exercises`. Разница до и после минимальна: до оптимизации уже использовался уникальный индекс `workout_exercises_workout_id_position_key`, который автоматически создается ограничением `UNIQUE (workout_id, position)`. Поэтому индекс `idx_fitness_tracker_workout_exercises_workout_position` в этой части дублирует существующую структуру и не дает выигрыша на данном запросе.

## Оптимизация статистики за период

Базовый запрос:

```sql
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
```

Оптимизация здесь основана на двух индексах: `idx_fitness_tracker_workouts_user_date_id` и `idx_fitness_tracker_workout_exercises_workout_position`. Первый ограничивает набор тренировок пользователя за нужный период, второй ускоряет присоединение строк из `workout_exercises`.

## Как воспроизвести планы выполнения

После запуска контейнеров через `docker compose up --build` планы можно снять так:

```bash
docker compose exec postgres psql -U fitness_tracker_user -d fitness_tracker_service_db_1
```

Внутри `psql` нужно поочередно выполнить команды:

```sql
EXPLAIN
SELECT id, title, planned_date, notes
FROM fitness_tracker.workouts
WHERE user_id = 3
  AND planned_date BETWEEN DATE '2026-03-01' AND DATE '2026-03-31'
ORDER BY planned_date DESC, id DESC;

EXPLAIN
SELECT
    we.id,
    e.id AS exercise_id,
    e.name,
    e.muscle_group,
    we.sets,
    we.reps,
    we.duration_minutes
FROM fitness_tracker.workout_exercises we
JOIN fitness_tracker.exercises e ON e.id = we.exercise_id
WHERE we.workout_id = 4
ORDER BY we.position, we.id;

EXPLAIN
SELECT
    COUNT(DISTINCT w.id) AS workout_count,
    COUNT(we.id) AS exercise_entries_count,
    COALESCE(SUM(we.duration_minutes), 0) AS total_minutes,
    COALESCE(ROUND(SUM(we.duration_minutes * e.calories_per_minute)::numeric, 2), 0)::double precision AS total_calories
FROM fitness_tracker.workouts w
LEFT JOIN fitness_tracker.workout_exercises we ON we.workout_id = w.id
LEFT JOIN fitness_tracker.exercises e ON e.id = we.exercise_id
WHERE w.user_id = 3
  AND w.planned_date BETWEEN DATE '2026-03-01' AND DATE '2026-03-31';
```

Фактический план до создания индексов:

```text
Aggregate
  ->  Sort
        Sort Key: w.id
        ->  Nested Loop Left Join
              ->  Nested Loop Left Join
                    ->  Seq Scan on workouts w
                          Filter: ((planned_date >= '2026-03-01'::date) AND (planned_date <= '2026-03-31'::date) AND (user_id = 3))
                    ->  Bitmap Heap Scan on workout_exercises we
                          Recheck Cond: (workout_id = w.id)
                          ->  Bitmap Index Scan on workout_exercises_workout_id_position_key
                                Index Cond: (workout_id = w.id)
              ->  Index Scan using exercises_pkey on exercises e
                    Index Cond: (id = we.exercise_id)
```

Фактический план после создания индексов:

```text
Aggregate
  ->  Sort
        Sort Key: w.id
        ->  Nested Loop Left Join
              ->  Nested Loop Left Join
                    ->  Index Only Scan using idx_fitness_tracker_workouts_user_date_id on workouts w
                          Index Cond: ((user_id = 3) AND (planned_date >= '2026-03-01'::date) AND (planned_date <= '2026-03-31'::date))
                    ->  Bitmap Heap Scan on workout_exercises we
                          Recheck Cond: (workout_id = w.id)
                          ->  Bitmap Index Scan on idx_fitness_tracker_workout_exercises_workout_position
                                Index Cond: (workout_id = w.id)
              ->  Index Scan using exercises_pkey on exercises e
                    Index Cond: (id = we.exercise_id)
```

Здесь улучшение также связано с индексом `idx_fitness_tracker_workouts_user_date_id`: PostgreSQL перестает делать `Seq Scan on workouts w` и переходит на `Index Only Scan`, то есть количество читаемых строк и стоимость фильтрации уменьшаются. Доступ к `workout_exercises` и до, и после шел через индекс по `(workout_id, position)`, который уже существовал из-за ограничения уникальности.