import { Database } from "bun:sqlite";
import express from "express";
import { z } from "zod";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = new Database("db.sqlite");

// TODO:
// - Where to store the database file?
// - Remove the typescript errors
// - Make sure each endpoint actually works
// - Update the way the frontend calls the endpoints 

db.run(`
  CREATE TABLE IF NOT EXISTS user_info (
    user_id INTEGER PRIMARY KEY,
    email TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS weight_entries (
    user_id INTEGER NOT NULL,
    date TEXT UNIQUE NOT NULL,
    weight INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS strength_exercises (
    user_id INTEGER NOT NULL,
    name TEXT UNIQUE NOT NULL,
    reps INTEGER NOT NULL,
    sets INTEGER NOT NULL,
    weight INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS hiit_exercises (
    user_id INTEGER NOT NULL,
    name TEXT UNIQUE NOT NULL,
    work_duration INTEGER NOT NULL,
    rest_duration INTEGER NOT NULL,
    rounds INTEGER NOT NULL
  );
`);

// Get the schema that describes the endpoint's expected request body
function getSchema(endpoint: string) {
  const numeric = z.string().regex(/^\d+$/).transform(Number);
  const str = z.string().min(1).max(250);

  const schemas: Record<string, object> = {
    "/user_data": z.object({ userId: numeric }),
    "/set_weight_entry": z.object({
      userId: numeric,
      date: str,
      weight: numeric
    }),
    "/update_exercise": z.object({
      userId: numeric,
      hiit: z.optional(z.object({
        name: str,
        workDuration: numeric,
        restDuration: numeric,
        rounds: numeric,
      })),
      strength: z.optional(z.object({
        name: str,
        reps: numeric,
        sets: numeric,
        weight: numeric
      }))
    }),
    "/delete_exercise": z.object({
      userId: numeric,
      name: str,
      isHiit: z.boolean(),
    })
  };
  return schemas[endpoint];
}

// Validate the request body
function validate(request: Request, response: Response, next: NextFunction) {
  // Check if it matches the expected schema 
  const result = getSchema(request.path).safeParse(request.body);
  if (!result.success) {
    response.json({ success: false });
    return;
  }

  // Check if it's a valid userId
  const sql = `SELECT * FROM user_info WHERE user_id=?`;
  const values = db.query(sql).all(result.data.userId);
  if (values.length != 1) {
    response.json({ success: false });
    return;
  }

  response.locals.params = result.data;
  next();
}

app.use(validate);

app.post("/user_data", (_request, response) => {
  const userId = Number(response.locals.params.userId);

  let weightEntries: Record<string, number> = {};
  const sql1 = "SELECT * FROM weight_entries WHERE user_id=?";
  const entries = db.query(sql1).all([userId]);
  for (const entry of entries) {
    weightEntries[entry.date] = entry.weight;
  }

  let exercises = [];
  for (const table of ["hiit_exercises", "strength_exercises"]) {
    const sql2 = `SELECT * FROM ${table} WHERE user_id=?`;
    const values = db.query(sql2).all([userId]);
    for (const value of values) {
      delete value["user_id"];
      exercises.push(value);
    }
  }

  response.json({ success: true, weightEntries: weightEntries, exercises: exercises });
});

app.post("/set_weight_entry", (_request, response) => {
  const { userId, date, weight } = response.locals.params;
  const sql = "INSERT OR REPLACE INTO weight_entries (user_id, date, weight) VALUES (?, ?, ?)";
  db.query(sql).run([userId, date, weight]);
  response.json({ success: true });
});

app.post("/update_exercise", (_request, response) => {
  const { userId, hiit, strength } = response.locals.params;

  const values = hiit !== undefined
    ? [userId, hiit.name, hiit.workDuration, hiit.restDuration, hiit.rounds]
    : [userId, strength.name, strength.reps, strength.sets, strength.weight];
  const fields = hiit !== undefined
    ? "user_id, name, work_duration, rest_duration, rounds"
    : "user_id, name, reps, sets, weight";
  const table = hiit !== undefined ? "hiit_exercises" : "strength_exercises";
  const sql = `INSERT OR REPLACE INTO ${table} (${fields}) VALUES (?,?,?,?,?,?);`;

  db.query(sql).run(values);
  response.json({ success: true, id: id });
});

app.delete("/delete_exercise", (_request, response) => {
  const { userId, name, isHiit } = response.locals.params;

  try {
    const table = isHiit ? "hiit_exercises" : "strength_exercises";
    const sql = `DELETE FROM ${table} WHERE user_id=? AND name=?`;
    db.query(sql).run([userId, name]);
    response.json({ success: true });
  } catch (error) {
    // Perhaps the exercise doesn't exist to begin with
    response.json({ sucess: false });
  }
});

app.listen(8080, () => console.log("Listening at http://localhost:8080"));
