async def _register_and_login(service_client):
    register_response = await service_client.post(
        '/v1/auth/register',
        json={
            'login': 'athlete',
            'first_name': 'Anna',
            'last_name': 'Strong',
            'password': 'secret123',
        },
    )
    assert register_response.status == 201

    login_response = await service_client.post(
        '/v1/auth/login',
        json={'login': 'athlete', 'password': 'secret123'},
    )
    assert login_response.status == 200
    payload = login_response.json()
    assert payload['user']['login'] == 'athlete'
    return payload['token']


async def test_register_login_and_user_search(service_client):
    await _register_and_login(service_client)

    by_login = await service_client.get(
        '/v1/users/by-login',
        params={'login': 'athlete'},
    )
    assert by_login.status == 200
    assert by_login.json()['user']['first_name'] == 'Anna'

    by_name = await service_client.get(
        '/v1/users/search',
        params={'query': 'Anna'},
    )
    assert by_name.status == 200
    assert len(by_name.json()['users']) == 1


async def test_protected_routes_require_auth(service_client):
    response = await service_client.post(
        '/v1/workouts',
        json={'title': 'Leg Day', 'planned_date': '2026-03-25'},
    )
    assert response.status == 401


async def test_workout_flow_and_statistics(service_client):
    token = await _register_and_login(service_client)
    headers = {'Authorization': f'Bearer {token}'}

    exercise_1 = await service_client.post(
        '/v1/exercises',
        headers=headers,
        json={
            'name': 'Squats',
            'muscle_group': 'Legs',
            'calories_per_minute': 8,
            'description': 'Lower body exercise',
        },
    )
    assert exercise_1.status == 201
    squat_id = exercise_1.json()['id']

    exercise_2 = await service_client.post(
        '/v1/exercises',
        headers=headers,
        json={
            'name': 'Burpees',
            'muscle_group': 'Cardio',
            'calories_per_minute': 10,
            'description': 'Full body interval movement',
        },
    )
    assert exercise_2.status == 201
    burpee_id = exercise_2.json()['id']

    exercise_list = await service_client.get('/v1/exercises')
    assert exercise_list.status == 200
    assert any(item['name'] == 'Squats' for item in exercise_list.json()['exercises'])

    workout = await service_client.post(
        '/v1/workouts',
        headers=headers,
        json={
            'title': 'Morning Conditioning',
            'planned_date': '2026-03-25',
            'notes': 'Focus on tempo',
        },
    )
    assert workout.status == 201
    workout_id = workout.json()['id']

    add_first = await service_client.post(
        f'/v1/workouts/{workout_id}/exercises',
        headers=headers,
        json={
            'exercise_id': squat_id,
            'sets': 4,
            'reps': 10,
            'duration_minutes': 30,
        },
    )
    assert add_first.status == 201

    add_second = await service_client.post(
        f'/v1/workouts/{workout_id}/exercises',
        headers=headers,
        json={
            'exercise_id': burpee_id,
            'sets': 3,
            'reps': 12,
            'duration_minutes': 15,
        },
    )
    assert add_second.status == 201

    history = await service_client.get('/v1/workouts/history', headers=headers)
    assert history.status == 200
    workouts = history.json()['workouts']
    assert len(workouts) == 1
    assert workouts[0]['title'] == 'Morning Conditioning'
    assert len(workouts[0]['exercises']) == 2
    assert workouts[0]['total_duration_minutes'] == 45

    stats = await service_client.get(
        '/v1/workouts/statistics',
        headers=headers,
        params={'from': '2026-03-01', 'to': '2026-03-31'},
    )
    assert stats.status == 200
    payload = stats.json()
    assert payload['workout_count'] == 1
    assert payload['exercise_entries_count'] == 2
    assert payload['total_exercise_minutes'] == 45
    assert payload['total_calories_burned'] == 390
