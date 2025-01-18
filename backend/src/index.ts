/*
TODO:
- STRESS TEST!!!!!
  - Validate the response body to make sure we're not only getting the right fields, but also
    the right data types. Return an error response otherwise
  - Validate the user id to make sure it actually exists within the database 
  - handle potential database errors
  - Adjust the way the frontend calls the api. For example, the exercise id should be a string (UUID) not an int
  - Yeah, each exercise is uniquely identified, but we don't actually have any safeguards to stop
    us from defining a new exercise that has the exact same values, just with a different id since
    we're not editing an existing exercise. You know what I mean? I think the solution would be
    to ignore the id and make sure we don't have a similar exercise already.
  - The update exercises endpoint is unnecessarily complicated
  - Document, and explain each endpoint and query
*/

import { Database } from "bun:sqlite";
import { randomUUIDv7 } from "bun";
import express from "express";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = new Database("db.sqlite");

db.run(`
  CREATE TABLE IF NOT EXISTS user_info (
    userId INTEGER PRIMARY KEY,
    email TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS weight_entries (
    userId INTEGER NOT NULL,
    date TEXT UNIQUE NOT NULL,
    weight INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS strength_exercises (
    id TEXT UNIQUE NOT NULL,
    userId INTEGER NOT NULL,
    name TEXT NOT NULL,
    reps INTEGER NOT NULL,
    sets INTEGER NOT NULL,
    weight INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS hiit_exercises (
    id TEXT UNIQUE NOT NULL,
    userId INTEGER NOT NULL,
    name TEXT NOT NULL,
    workDuration INTEGER NOT NULL,
    restDuration INTEGER NOT NULL,
    rounds INTEGER NOT NULL
  );
`);

app.get("/user_data", (_request, response) => {
  const userId = Number(request.body.userId);

  let weightEntries: Record<string, number> = {};
  const sql1 = "SELECT * FROM weight_entries WHERE userId=?";
  const entries = db.query(sql1).all([userId]);
  for (const entry of entries) {
    weightEntries[entry.date] = entry.weight;
  }

  let exercises = [];
  for (const table of ["hiit_exercises", "strength_exercises"]) {
    const sql2 = `SELECT * FROM ${table} WHERE userId=?`;
    const values = db.query(sql2).all([userId]);
    for (const value of values) {
      delete value["userId"];
      exercises.push(value);
    }
  }

  response.json({ success: true, weightEntries: weightEntries, exercises: exercises });
});

app.post("/set_weight_entry", (request, response) => {
  const date = request.body.date;
  const weight = Number(request.body.weight);
  const userId = Number(request.body.userId);
  const sql = "INSERT OR REPLACE INTO weight_entries (userId, date, weight) VALUES (?, ?, ?)";
  db.query(sql).run([userId, date, weight]);
  response.json({ success: true });
});

app.post("/update_exercise", (request, response) => {
  const userId = Number(request.body.userId);
  const exercise = request.body.exercise;

  const id = exercise.id !== undefined ? exercise.id : randomUUIDv7();
  const isHiit = exercise.rounds !== undefined;

  const hiitFields = "id, userId, name, workDuration, restDuration, rounds";
  const hiitValues = [
    id, userId, exercise.name,
    Number(exercise.workDuration), Number(exercise.restDuration), Number(exercise.rounds)
  ];

  const strengthFields = "id, userId, name, reps, sets, weight";
  const strengthValues = [
    id, userId, exercise.name,
    Number(exercise.reps), Number(exercise.sets), Number(exercise.weight)
  ];

  const sql = `
    INSERT OR REPLACE INTO ${isHiit ? "hiit_exercises" : "strength_exercises"}
    (${isHiit ? hiitFields : strengthFields}) VALUES (?, ?, ?, ?, ?, ?);
  `;

  db.query(sql).run(isHiit ? hiitValues : strengthValues);
  response.json({ success: true, id: id });
});

app.delete("/delete_exercise", (request, response) => {
  console.log("LOG: deleting exercise", request.body);
  response.json({ success: true });
});

app.listen(8080, () => console.log("Backend listening on port 8080"));
