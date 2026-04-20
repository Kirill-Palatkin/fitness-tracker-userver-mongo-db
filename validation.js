const database = db.getSiblingDB("fitness_tracker_mongo");

function createOrUpdateCollection(name, validator) {
  const exists = database.getCollectionNames().includes(name);
  if (exists) {
    database.runCommand({
      collMod: name,
      validator,
      validationLevel: "strict",
      validationAction: "error"
    });
  } else {
    database.createCollection(name, {
      validator,
      validationLevel: "strict",
      validationAction: "error"
    });
  }
}

createOrUpdateCollection("users", {
  $jsonSchema: {
    bsonType: "object",
    required: ["user_id", "login", "first_name", "last_name", "password_hash", "created_at"],
    properties: {
      user_id: { bsonType: "int", minimum: 1 },
      login: { bsonType: "string", pattern: "^[a-zA-Z0-9_]{3,32}$" },
      first_name: { bsonType: "string", minLength: 1 },
      last_name: { bsonType: "string", minLength: 1 },
      password_hash: { bsonType: "string", minLength: 4 },
      profile: {
        bsonType: "object",
        properties: {
          height_cm: { bsonType: "int", minimum: 1, maximum: 260 },
          weight_kg: { bsonType: ["int", "double"], minimum: 1, maximum: 400 },
          level: { enum: ["beginner", "intermediate", "advanced"] }
        }
      },
      goals: { bsonType: "array", items: { bsonType: "string" } },
      created_at: { bsonType: "date" }
    }
  }
});

createOrUpdateCollection("exercises", {
  $jsonSchema: {
    bsonType: "object",
    required: ["name", "muscle_group", "calories_per_minute", "description"],
    properties: {
      exercise_id: { bsonType: "int", minimum: 1 },
      name: { bsonType: "string", minLength: 1 },
      muscle_group: { bsonType: "string", minLength: 1 },
      calories_per_minute: { bsonType: "int", minimum: 1, maximum: 50 },
      description: { bsonType: "string" },
      equipment: {
        bsonType: "object",
        properties: {
          required: { bsonType: "bool" },
          items: { bsonType: "array", items: { bsonType: "string" } }
        }
      },
      tags: { bsonType: "array", items: { bsonType: "string" } },
      created_by: { bsonType: ["int", "long"] },
      created_at: { bsonType: "date" },
      source: { bsonType: "string" }
    }
  }
});

createOrUpdateCollection("workouts", {
  $jsonSchema: {
    bsonType: "object",
    required: ["workout_id", "user_id", "title", "planned_date", "exercises", "created_at"],
    properties: {
      workout_id: { bsonType: "int", minimum: 1 },
      user_id: { bsonType: "int", minimum: 1 },
      title: { bsonType: "string", minLength: 1 },
      planned_date: { bsonType: "date" },
      notes: { bsonType: "string" },
      exercises: {
        bsonType: "array",
        minItems: 1,
        items: {
          bsonType: "object",
          required: ["exercise_id", "name", "sets", "reps", "duration_minutes", "calories_burned"],
          properties: {
            exercise_id: { bsonType: "int", minimum: 1 },
            name: { bsonType: "string", minLength: 1 },
            sets: { bsonType: "int", minimum: 1 },
            reps: { bsonType: "int", minimum: 1 },
            duration_minutes: { bsonType: "int", minimum: 1 },
            calories_burned: { bsonType: ["int", "long", "double"], minimum: 0 }
          }
        }
      },
      created_at: { bsonType: "date" }
    }
  }
});

database.users.createIndex({ login: 1 }, { unique: true });
database.users.createIndex({ last_name: 1, first_name: 1 });
database.exercises.createIndex({ name: 1, muscle_group: 1 }, { unique: true });
database.exercises.createIndex({ muscle_group: 1 });
database.workouts.createIndex({ user_id: 1, planned_date: -1 });
database.workouts.createIndex({ "exercises.exercise_id": 1 });

try {
  database.exercises.insertOne({
    name: "",
    muscle_group: "Invalid",
    calories_per_minute: -1,
    description: "This document must be rejected"
  });
} catch (error) {
  print("Validation rejected invalid exercise document");
}
