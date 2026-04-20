const database = db.getSiblingDB("fitness_tracker_mongo");

print("Create user");
printjson(database.users.insertOne({
  user_id: 101,
  login: "demo_user",
  first_name: "Demo",
  last_name: "User",
  password_hash: "demo_hash",
  profile: { height_cm: 175, weight_kg: 72, level: "beginner" },
  goals: ["fitness"],
  created_at: new Date()
}));

print("Read user by login with $eq");
printjson(database.users.findOne({ login: { $eq: "demo_user" } }));

print("Read users by first name or last name mask with $or");
printjson(database.users.find({
  $or: [
    { first_name: /Demo/i },
    { last_name: /User/i }
  ]
}).toArray());

print("Update user goals with $addToSet");
printjson(database.users.updateOne(
  { login: "demo_user" },
  { $addToSet: { goals: "strength" } }
));

print("Create exercise");
printjson(database.exercises.insertOne({
  exercise_id: 101,
  name: "Demo Squats",
  muscle_group: "Legs",
  calories_per_minute: 9,
  description: "Demo lower body exercise",
  equipment: { required: false, items: [] },
  tags: ["demo", "legs"],
  created_by: 101,
  created_at: new Date()
}));

print("Read exercises with $in and $gt");
printjson(database.exercises.find({
  muscle_group: { $in: ["Legs", "Cardio"] },
  calories_per_minute: { $gt: 7 }
}).toArray());

print("Update exercise tags with $push");
printjson(database.exercises.updateOne(
  { exercise_id: 101 },
  { $push: { tags: "updated" } }
));

print("Create workout");
printjson(database.workouts.insertOne({
  workout_id: 101,
  user_id: 101,
  title: "Demo Workout",
  planned_date: new Date("2026-04-01T00:00:00Z"),
  notes: "MongoDB CRUD demo",
  exercises: [
    {
      exercise_id: 101,
      name: "Demo Squats",
      sets: 3,
      reps: 12,
      duration_minutes: 20,
      calories_burned: 180
    }
  ],
  created_at: new Date()
}));

print("Add exercise to workout with $push");
printjson(database.workouts.updateOne(
  { workout_id: 101 },
  {
    $push: {
      exercises: {
        exercise_id: 1,
        name: "Push-ups",
        sets: 4,
        reps: 15,
        duration_minutes: 15,
        calories_burned: 120
      }
    }
  }
));

print("Read workout history with $and, $gte and $lte");
printjson(database.workouts.find({
  $and: [
    { user_id: { $eq: 101 } },
    { planned_date: { $gte: new Date("2026-04-01T00:00:00Z") } },
    { planned_date: { $lte: new Date("2026-04-30T23:59:59Z") } }
  ]
}).sort({ planned_date: -1 }).toArray());

print("Read workouts with $ne and $lt");
printjson(database.workouts.find({
  user_id: { $ne: 101 },
  planned_date: { $lt: new Date("2026-03-15T00:00:00Z") }
}).toArray());

print("Aggregation statistics for period");
printjson(database.workouts.aggregate([
  {
    $match: {
      user_id: 101,
      planned_date: {
        $gte: new Date("2026-04-01T00:00:00Z"),
        $lte: new Date("2026-04-30T23:59:59Z")
      }
    }
  },
  { $unwind: "$exercises" },
  {
    $group: {
      _id: "$user_id",
      workout_count: { $addToSet: "$workout_id" },
      exercise_entries_count: { $sum: 1 },
      total_minutes: { $sum: "$exercises.duration_minutes" },
      total_calories: { $sum: "$exercises.calories_burned" }
    }
  },
  {
    $project: {
      _id: 0,
      user_id: "$_id",
      workout_count: { $size: "$workout_count" },
      exercise_entries_count: 1,
      total_minutes: 1,
      total_calories: 1
    }
  },
  { $sort: { total_calories: -1 } }
]).toArray());

print("Remove exercise from workout with $pull");
printjson(database.workouts.updateOne(
  { workout_id: 101 },
  { $pull: { exercises: { exercise_id: 1 } } }
));

print("Delete demo workout");
printjson(database.workouts.deleteOne({ workout_id: 101 }));

print("Delete demo exercise");
printjson(database.exercises.deleteOne({ exercise_id: 101 }));

print("Delete demo user");
printjson(database.users.deleteOne({ user_id: 101 }));
