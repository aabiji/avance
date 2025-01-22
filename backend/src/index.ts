import { Database } from "bun:sqlite";
import { z } from "zod";
import { type Request, type Response, type NextFunction } from 'express';
import express from "express";

// Setup the database
const db = new Database("example.sqlite");
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    userId INTEGER PRIMARY KEY,
    email TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS weightEntries (
    userId INTEGER NOT NULL,
    date TEXT UNIQUE NOT NULL,
    weight INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS strengthExercises (
    userId INTEGER NOT NULL,
    name TEXT UNIQUE NOT NULL,
    weekDay INTEGER NOT NULL,
    reps INTEGER NOT NULL,
    sets INTEGER NOT NULL,
    weight INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS hiitExercises (
    userId INTEGER NOT NULL,
    name TEXT UNIQUE NOT NULL,
    weekDay INTEGER NOT NULL,
    workDuration INTEGER NOT NULL,
    restDuration INTEGER NOT NULL,
    rounds INTEGER NOT NULL
  );
`);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Get the schema that describes the endpoint's expected request body
function getSchema(endpoint: string) {
  const str = z.string().min(1).max(250);
  const strNum = z.string().regex(/^\d+$/).transform(Number);
  const num = z.number().int().nonnegative().finite();
  const numeric = strNum.or(num);

  const schemas: Record<string, z.ZodObject<any>> = {
    "/userData": z.object({ userId: numeric }),
    "/setWeightEntry": z.object({
      userId: numeric,
      date: str,
      weight: numeric
    }),
    "/updateExercise": z.object({
      userId: numeric,
      weekDay: numeric,
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
    "/deleteExercise": z.object({
      userId: numeric,
      name: str,
      isHiit: z.boolean(),
    })
  };
  return schemas[endpoint].strict();
}

function validateRequest(request: Request, response: Response, next: NextFunction) {
  // Only validate the requests of certain endpoints
  const ignoredEndpoints = ["/authenticate"];
  const allEndpoints = app._router.stack
    .filter((r: Request) => r.route)
    .map((r: Request) => r.route.path);
  if (ignoredEndpoints.includes(request.path) ||
    !allEndpoints.includes(request.path)) {
    next();
    return;
  }

  // Check if the request body matches the expected schema
  const result = getSchema(request.path).safeParse(request.body);
  if (!result.success) {
    response.json({ error: true });
    return;
  }

  // TODO: remove the userid from the schemas, instead get it from the authorization header
  // Check if it's a valid userId
  const sql = `SELECT * FROM users WHERE userId=?`;
  const values = db.query(sql).all(result.data.userId);
  if (values.length != 1) {
    response.json({ error: true });
    return;
  }

  response.locals.params = result.data;
  next();
}

app.use(validateRequest);

app.get("/authenticate", (request, response) => {
  // TODO: Get the user's email with "Login with Google" OAuth
  // https://codeculturepro.medium.com/implementing-google-login-in-a-node-js-application-b6fbd98ce5e
  // If the user's email is already in the database, then just use the existing user id
  // Else, create a new database row
  // Create a new json web token
  // Return the json web token
});

app.post("/userData", (_request, response) => {
  console.log("LOG: /userData");
  const userId = Number(response.locals.params.userId);

  let weightEntries: Record<string, number> = {};
  const sql1 = "SELECT * FROM weightEntries WHERE userId=?";
  const entries = db.query(sql1).all(userId);
  for (const entry of entries) {
    weightEntries[entry.date] = entry.weight;
  }

  let exercises = [];
  for (const table of ["hiitExercises", "strengthExercises"]) {
    const sql2 = `SELECT * FROM ${table} WHERE userId=?`;
    const values = db.query(sql2).all(userId);
    for (const value of values) {
      delete value["userId"];
      exercises.push(value);
    }
  }

  response.json({ error: false, weightEntries: weightEntries, exercises: exercises });
});

app.post("/setWeightEntry", (_request, response) => {
  console.log("LOG: /weight_entry");
  const { userId, date, weight } = response.locals.params;
  const sql = "INSERT OR REPLACE INTO weightEntries (userId, date, weight) VALUES (?, ?, ?)";
  db.query(sql).run(userId, date, weight);
  response.json({ error: false });
});

app.post("/updateExercise", (_request, response) => {
  console.log("LOG: /updateExercise");
  const { userId, weekDay, hiit, strength } = response.locals.params;

  const values = hiit !== undefined
    ? [userId, hiit.name, weekDay, hiit.workDuration, hiit.restDuration, hiit.rounds]
    : [userId, strength.name, weekDay, strength.reps, strength.sets, strength.weight];
  const fields = hiit !== undefined
    ? "userId, name, weekDay, workDuration, restDuration, rounds"
    : "userId, name, weekDay, reps, sets, weight";
  const table = hiit !== undefined ? "hiitExercises" : "strengthExercises";
  const sql = `INSERT OR REPLACE INTO ${table} (${fields}) VALUES (?,?,?,?,?,?);`;

  db.query(sql).run(...values);
  response.json({ error: false });
});

app.delete("/deleteExercise", (_request, response) => {
  console.log("LOG: /deleteExercise");
  const { userId, name, isHiit } = response.locals.params;
  const table = isHiit ? "hiitExercises" : "strengthExercises";
  const sql = `DELETE FROM ${table} WHERE userId=? AND name=?`;
  const result = db.query(sql).run(userId, name);
  response.json({ error: result.changes != 1 });
});

app.all("*", (_request, response) => { response.send("404"); });

app.listen(8080, () => console.log("Listening at http://localhost:8080"));
