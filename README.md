# Фитнес-трекер

Реализованные endpoint-ы:

- `POST /v1/auth/register`
- `POST /v1/auth/login`
- `GET /v1/users/by-login`
- `GET /v1/users/search`
- `GET /v1/exercises`
- `POST /v1/exercises`
- `POST /v1/workouts`
- `POST /v1/workouts/{workout_id}/exercises`
- `GET /v1/workouts/history`
- `GET /v1/workouts/statistics`

## Запуск через Docker

```bash
docker compose up --build
```
После запуска API будет доступен по адресу `http://localhost:8080`.

- `schema.sql` - создание схемы БД, таблиц и индексов
- `data.sql` - тестовые данные
- `queries.sql` - SQL-запросы для основных операций системы
- `optimization.md` - описание оптимизаций и запросов для анализа через EXPLAIN

## Схема базы данных

- `users` - пользователи системы. Содержит логин, имя, фамилию, соль и хэш пароля. Первичный ключ: `id`. Поле `login` уникально.
- `sessions` - активные пользовательские сессии. Содержит токен, дату создания и срок действия. Первичный ключ: `token`. Внешний ключ `user_id` ссылается на `users(id)`.
- `exercises` - справочник упражнений. Содержит название, группу мышц, калории в минуту, описание и автора упражнения. Первичный ключ: `id`. Внешний ключ `created_by` ссылается на `users(id)`. Пара `(name, muscle_group)` уникальна.
- `workouts` - тренировки пользователей. Содержит владельца тренировки, название, дату и заметки. Первичный ключ: `id`. Внешний ключ `user_id` ссылается на `users(id)`.
- `workout_exercises` - упражнения внутри конкретной тренировки. Содержит ссылку на тренировку, упражнение, количество подходов, повторений, длительность и позицию в тренировке. Первичный ключ: `id`. Внешние ключи `workout_id` и `exercise_id` ссылаются на `workouts(id)` и `exercises(id)`. Пара `(workout_id, position)` уникальна.

Основные связи между таблицами:

- один пользователь может иметь много сессий;
- один пользователь может создать много упражнений;
- один пользователь может иметь много тренировок;
- одна тренировка может содержать много упражнений через таблицу `workout_exercises`.

## Пример сценария работы

Регистрация:

```bash
curl -X POST http://localhost:8080/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "login":"athlete",
    "first_name":"Kirill",
    "last_name":"Palatkin",
    "password":"12345678"
  }'
```

Вход:

```bash
curl -X POST http://localhost:8080/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "login":"athlete",
    "password":"12345678"
  }'
```

Создание упражнения:

```bash
curl -X POST http://localhost:8080/v1/exercises \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Squats",
    "muscle_group":"Legs",
    "calories_per_minute":8,
    "description":"Упражнения для нижней части тела"
  }'
```

Создание тренировки:

```bash
curl -X POST http://localhost:8080/v1/workouts \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Утренняя тренировка",
    "planned_date":"2026-03-28",
    "notes":"Сосредоточиться на темпе"
  }'
```

Получение статистики:

```bash
curl "http://localhost:8080/v1/workouts/statistics?from=2026-03-01&to=2026-03-31" \
  -H "Authorization: Bearer <token>"
```

## Тесты

Тесты находятся в `tests/test_fitness_tracker.py`.


## OpenAPI

Контракт API описан в `openapi.yaml`.
