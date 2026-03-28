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
