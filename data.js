const database = db.getSiblingDB("fitness_tracker_mongo");

database.workouts.deleteMany({});
database.exercises.deleteMany({});
database.users.deleteMany({});

database.users.insertMany([
  {
    user_id: 1,
    login: "athlete01",
    first_name: "Kirill",
    last_name: "Palatkin",
    password_hash: "hash01",
    profile: { height_cm: 180, weight_kg: 78, level: "intermediate" },
    goals: ["strength", "endurance"],
    created_at: new Date("2026-03-01T10:00:00Z")
  },
  {
    user_id: 2,
    login: "athlete02",
    first_name: "Ivan",
    last_name: "Petrov",
    password_hash: "hash02",
    profile: { height_cm: 176, weight_kg: 82, level: "beginner" },
    goals: ["weight-loss"],
    created_at: new Date("2026-03-02T10:00:00Z")
  },
  {
    user_id: 3,
    login: "athlete03",
    first_name: "Anna",
    last_name: "Smirnova",
    password_hash: "hash03",
    profile: { height_cm: 168, weight_kg: 61, level: "advanced" },
    goals: ["mobility", "strength"],
    created_at: new Date("2026-03-03T10:00:00Z")
  },
  {
    user_id: 4,
    login: "athlete04",
    first_name: "Pavel",
    last_name: "Sidorov",
    password_hash: "hash04",
    profile: { height_cm: 184, weight_kg: 90, level: "intermediate" },
    goals: ["muscle-gain"],
    created_at: new Date("2026-03-04T10:00:00Z")
  },
  {
    user_id: 5,
    login: "athlete05",
    first_name: "Maria",
    last_name: "Kuznetsova",
    password_hash: "hash05",
    profile: { height_cm: 170, weight_kg: 64, level: "beginner" },
    goals: ["endurance"],
    created_at: new Date("2026-03-05T10:00:00Z")
  },
  {
    user_id: 6,
    login: "athlete06",
    first_name: "Oleg",
    last_name: "Volkov",
    password_hash: "hash06",
    profile: { height_cm: 181, weight_kg: 86, level: "advanced" },
    goals: ["strength"],
    created_at: new Date("2026-03-06T10:00:00Z")
  },
  {
    user_id: 7,
    login: "athlete07",
    first_name: "Elena",
    last_name: "Orlova",
    password_hash: "hash07",
    profile: { height_cm: 166, weight_kg: 59, level: "intermediate" },
    goals: ["cardio", "mobility"],
    created_at: new Date("2026-03-07T10:00:00Z")
  },
  {
    user_id: 8,
    login: "athlete08",
    first_name: "Dmitry",
    last_name: "Fedorov",
    password_hash: "hash08",
    profile: { height_cm: 178, weight_kg: 77, level: "beginner" },
    goals: ["fitness"],
    created_at: new Date("2026-03-08T10:00:00Z")
  },
  {
    user_id: 9,
    login: "athlete09",
    first_name: "Sofia",
    last_name: "Morozova",
    password_hash: "hash09",
    profile: { height_cm: 172, weight_kg: 65, level: "advanced" },
    goals: ["cardio"],
    created_at: new Date("2026-03-09T10:00:00Z")
  },
  {
    user_id: 10,
    login: "athlete10",
    first_name: "Nikita",
    last_name: "Alekseev",
    password_hash: "hash10",
    profile: { height_cm: 187, weight_kg: 92, level: "intermediate" },
    goals: ["muscle-gain", "strength"],
    created_at: new Date("2026-03-10T10:00:00Z")
  }
]);

database.exercises.insertMany([
  {
    exercise_id: 1,
    name: "Push-ups",
    muscle_group: "Chest",
    calories_per_minute: 8,
    description: "Classic bodyweight push exercise",
    equipment: { required: false, items: [] },
    tags: ["bodyweight", "strength"],
    created_by: 1,
    created_at: new Date("2026-03-01T10:10:00Z")
  },
  {
    exercise_id: 2,
    name: "Running",
    muscle_group: "Cardio",
    calories_per_minute: 10,
    description: "Steady-state cardio session",
    equipment: { required: true, items: ["running shoes"] },
    tags: ["cardio", "endurance"],
    created_by: 2,
    created_at: new Date("2026-03-02T10:10:00Z")
  },
  {
    exercise_id: 3,
    name: "Squats",
    muscle_group: "Legs",
    calories_per_minute: 9,
    description: "Lower body strength exercise",
    equipment: { required: false, items: [] },
    tags: ["legs", "strength"],
    created_by: 3,
    created_at: new Date("2026-03-03T10:10:00Z")
  },
  {
    exercise_id: 4,
    name: "Plank",
    muscle_group: "Core",
    calories_per_minute: 5,
    description: "Static core stability exercise",
    equipment: { required: false, items: [] },
    tags: ["core", "stability"],
    created_by: 4,
    created_at: new Date("2026-03-04T10:10:00Z")
  },
  {
    exercise_id: 5,
    name: "Burpees",
    muscle_group: "Cardio",
    calories_per_minute: 12,
    description: "Explosive full body exercise",
    equipment: { required: false, items: [] },
    tags: ["hiit", "cardio"],
    created_by: 5,
    created_at: new Date("2026-03-05T10:10:00Z")
  },
  {
    exercise_id: 6,
    name: "Pull-ups",
    muscle_group: "Back",
    calories_per_minute: 9,
    description: "Upper body pulling exercise",
    equipment: { required: true, items: ["pull-up bar"] },
    tags: ["back", "strength"],
    created_by: 6,
    created_at: new Date("2026-03-06T10:10:00Z")
  },
  {
    exercise_id: 7,
    name: "Lunges",
    muscle_group: "Legs",
    calories_per_minute: 8,
    description: "Single-leg lower body exercise",
    equipment: { required: false, items: [] },
    tags: ["legs", "balance"],
    created_by: 7,
    created_at: new Date("2026-03-07T10:10:00Z")
  },
  {
    exercise_id: 8,
    name: "Mountain Climbers",
    muscle_group: "Core",
    calories_per_minute: 11,
    description: "Dynamic core and cardio movement",
    equipment: { required: false, items: [] },
    tags: ["core", "cardio"],
    created_by: 8,
    created_at: new Date("2026-03-08T10:10:00Z")
  },
  {
    exercise_id: 9,
    name: "Jump Rope",
    muscle_group: "Cardio",
    calories_per_minute: 13,
    description: "Rope skipping cardio exercise",
    equipment: { required: true, items: ["jump rope"] },
    tags: ["cardio", "coordination"],
    created_by: 9,
    created_at: new Date("2026-03-09T10:10:00Z")
  },
  {
    exercise_id: 10,
    name: "Bench Dips",
    muscle_group: "Triceps",
    calories_per_minute: 7,
    description: "Bodyweight triceps exercise",
    equipment: { required: true, items: ["bench"] },
    tags: ["arms", "bodyweight"],
    created_by: 10,
    created_at: new Date("2026-03-10T10:10:00Z")
  }
]);

database.workouts.insertMany([
  {
    workout_id: 1,
    user_id: 1,
    title: "Morning Power",
    planned_date: new Date("2026-03-01T00:00:00Z"),
    notes: "Chest and core focus",
    exercises: [{ exercise_id: 1, name: "Push-ups", sets: 4, reps: 15, duration_minutes: 20, calories_burned: 160 }],
    created_at: new Date("2026-03-01T10:30:00Z")
  },
  {
    workout_id: 2,
    user_id: 2,
    title: "Park Run",
    planned_date: new Date("2026-03-03T00:00:00Z"),
    notes: "Cardio session in the park",
    exercises: [{ exercise_id: 2, name: "Running", sets: 1, reps: 1, duration_minutes: 30, calories_burned: 300 }],
    created_at: new Date("2026-03-03T10:30:00Z")
  },
  {
    workout_id: 3,
    user_id: 3,
    title: "Leg Day",
    planned_date: new Date("2026-03-05T00:00:00Z"),
    notes: "Lower body strength",
    exercises: [{ exercise_id: 3, name: "Squats", sets: 5, reps: 12, duration_minutes: 25, calories_burned: 225 }],
    created_at: new Date("2026-03-05T10:30:00Z")
  },
  {
    workout_id: 4,
    user_id: 4,
    title: "Core Control",
    planned_date: new Date("2026-03-07T00:00:00Z"),
    notes: "Stability and posture",
    exercises: [{ exercise_id: 4, name: "Plank", sets: 3, reps: 1, duration_minutes: 15, calories_burned: 75 }],
    created_at: new Date("2026-03-07T10:30:00Z")
  },
  {
    workout_id: 5,
    user_id: 5,
    title: "HIIT Blast",
    planned_date: new Date("2026-03-10T00:00:00Z"),
    notes: "Short intense intervals",
    exercises: [{ exercise_id: 5, name: "Burpees", sets: 4, reps: 10, duration_minutes: 18, calories_burned: 216 }],
    created_at: new Date("2026-03-10T10:30:00Z")
  },
  {
    workout_id: 6,
    user_id: 6,
    title: "Back Builder",
    planned_date: new Date("2026-03-12T00:00:00Z"),
    notes: "Upper back strength",
    exercises: [{ exercise_id: 6, name: "Pull-ups", sets: 4, reps: 8, duration_minutes: 22, calories_burned: 198 }],
    created_at: new Date("2026-03-12T10:30:00Z")
  },
  {
    workout_id: 7,
    user_id: 7,
    title: "Functional Legs",
    planned_date: new Date("2026-03-15T00:00:00Z"),
    notes: "Balance and coordination",
    exercises: [{ exercise_id: 7, name: "Lunges", sets: 4, reps: 12, duration_minutes: 20, calories_burned: 160 }],
    created_at: new Date("2026-03-15T10:30:00Z")
  },
  {
    workout_id: 8,
    user_id: 8,
    title: "Fast Core",
    planned_date: new Date("2026-03-18T00:00:00Z"),
    notes: "Core endurance",
    exercises: [{ exercise_id: 8, name: "Mountain Climbers", sets: 3, reps: 20, duration_minutes: 16, calories_burned: 176 }],
    created_at: new Date("2026-03-18T10:30:00Z")
  },
  {
    workout_id: 9,
    user_id: 9,
    title: "Rope Session",
    planned_date: new Date("2026-03-21T00:00:00Z"),
    notes: "Cardio with jump rope",
    exercises: [{ exercise_id: 9, name: "Jump Rope", sets: 1, reps: 1, duration_minutes: 25, calories_burned: 325 }],
    created_at: new Date("2026-03-21T10:30:00Z")
  },
  {
    workout_id: 10,
    user_id: 10,
    title: "Arm Finish",
    planned_date: new Date("2026-03-25T00:00:00Z"),
    notes: "Accessory upper body",
    exercises: [{ exercise_id: 10, name: "Bench Dips", sets: 4, reps: 15, duration_minutes: 18, calories_burned: 126 }],
    created_at: new Date("2026-03-25T10:30:00Z")
  }
]);
