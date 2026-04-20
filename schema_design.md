# Проектирование документной модели MongoDB

## Коллекции

### `users`

Коллекция хранит пользователей системы.

Пример структуры документа:

```json
{
  "user_id": 1,
  "login": "athlete01",
  "first_name": "Kirill",
  "last_name": "Palatkin",
  "password_hash": "hash01",
  "profile": {
    "height_cm": 180,
    "weight_kg": 78,
    "level": "intermediate"
  },
  "goals": ["strength", "endurance"],
  "created_at": "2026-03-01T10:00:00Z"
}
```

Поля `profile` и `goals` embedded, так как они относятся только к одному пользователю и читаются вместе с ним.

### `exercises`

Коллекция хранит справочник упражнений.

Пример структуры документа:

```json
{
  "exercise_id": 1,
  "name": "Push-ups",
  "muscle_group": "Chest",
  "calories_per_minute": 8,
  "description": "Classic bodyweight push exercise",
  "equipment": {
    "required": false,
    "items": []
  },
  "tags": ["bodyweight", "strength"],
  "created_by": 1,
  "created_at": "2026-03-01T10:10:00Z"
}
```

Упражнения вынесены в отдельную коллекцию, потому что они переиспользуются в разных тренировках. В тренировках хранится reference на `exercise_id` и краткий снимок названия упражнения.

### `workouts`

Коллекция хранит тренировки пользователей.

Пример структуры документа:

```json
{
  "workout_id": 1,
  "user_id": 1,
  "title": "Morning Power",
  "planned_date": "2026-03-01T00:00:00Z",
  "notes": "Chest and core focus",
  "exercises": [
    {
      "exercise_id": 1,
      "name": "Push-ups",
      "sets": 4,
      "reps": 15,
      "duration_minutes": 20,
      "calories_burned": 160
    }
  ],
  "created_at": "2026-03-01T10:30:00Z"
}
```

Тренировка хранит reference на пользователя через `user_id`. Список упражнений внутри тренировки сделан embedded-массивом, потому что упражнения тренировки почти всегда нужны вместе с самой тренировкой (при получении истории тренировок пользователь ожидает увидеть состав каждой тренировки).

## Embedded documents и references

- `users.profile` встроен в пользователя, потому что профиль не используется отдельно от пользователя.
- `users.goals` хранится массивом строк, потому что цели пользователя простые и не требуют отдельной коллекции.
- `exercises.equipment` встроен в упражнение, потому что оборудование является частью описания упражнения.
- `workouts.exercises` встроен в тренировку, потому что состав тренировки читается вместе с тренировкой и содержит параметры выполнения (подходы, повторения и т. д.).
- `workouts.user_id` является reference на `users.user_id`, потому что пользователь является отдельной сущностью и может иметь много тренировок.
- `workouts.exercises.exercise_id` является reference на `exercises.exercise_id`, потому что упражнение переиспользуется в разных тренировках.
- `exercises.created_by` является reference на `users.user_id`, потому что упражнение может быть создано конкретным пользователем.

## Индексы

- `users.login` уникальный индекс для быстрого поиска пользователя по логину.
- `users.last_name, users.first_name` индекс для поиска по маске имени и фамилии.
- `exercises.name, exercises.muscle_group` уникальный индекс для защиты от дублей упражнений.
- `exercises.muscle_group` индекс для фильтрации упражнений по группе мышц.
- `workouts.user_id, workouts.planned_date` индекс для получения истории тренировок пользователя и статистики за период.
- `workouts.exercises.exercise_id` индекс для поиска тренировок, где использовалось конкретное упражнение.

## Подключение к API

Для демонстрации подключения API к MongoDB добавлены endpoint-ы:

- `GET /v1/mongo/exercises` - получение списка упражнений из MongoDB
- `POST /v1/mongo/exercises` - создание упражнения в MongoDB
