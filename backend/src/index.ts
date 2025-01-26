import { Database } from "bun:sqlite";
import { randomUUIDv7 } from "bun";
import { sign, verify } from "jsonwebtoken";
import { type Request, type Response, type NextFunction } from 'express';
import express from "express";
import { z } from "zod";

// Setup the database
// TODO: use postgresql at some point: https://bun.sh/docs/api/sql
const db = new Database("example.sqlite");
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    userId INTEGER PRIMARY KEY,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    salt TEXT NOT NULL
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
    "/authenticate": z.object({
      email: str.email(),
      password: str,
    }),
    "/setWeightEntry": z.object({
      date: str,
      weight: numeric
    }),
    "/updateExercise": z.object({
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
      name: str,
      isHiit: z.boolean(),
    })
  };
  return endpoint in schemas ? schemas[endpoint].strict() : undefined;
}

function validateRequest(request: Request, response: Response, next: NextFunction) {
  // Ignore undefined endpoints
  const allEndpoints = app._router.stack
    .filter((r: Request) => r.route)
    .map((r: Request) => r.route.path);
  if (!allEndpoints.includes(request.path)) {
    next();
    return;
  }

  // Check if the request body matches the expected schema
  const schema = getSchema(request.path);
  if (schema !== undefined) {
    const result = schema.safeParse(request.body);
    if (!result.success) {
      response.json({ error: true, message: "Invalid request" });
      return;
    }
    response.locals.params = result.data;
  }

  // Certain endpoints don't need to be authenticated
  const ignoredEndpoints = ["/authenticate"];
  if (ignoredEndpoints.includes(request.path)) {
    next();
    return;
  }

  // Verify the userId that's taken from the json web token in the request header
  const auth = request.headers["authorization"];
  if (auth === undefined || auth.split(" ").length != 2) {
    response.json({ error: true, message: "Invalid Authorization header" });
    return;
  }
  const token = auth.split(" ")[1] as string;

  verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error != null) {
      response.json({ error: true, message: "Invalid token" });
      return;
    }

    const sql = `SELECT * FROM users WHERE userId=?`;
    const values = db.query(sql).all(decoded.userId);
    if (values.length != 1) {
      response.json({ error: true, message: "User not found" });
      return;
    }

    response.locals.params = { ...response.locals.params, userId: decoded.userId };
    next();
  });
}

app.use(validateRequest);

// Verifies a user's account if it already exists, or create a new one
app.post("/authenticate", async (_request, response) => {
  console.log("LOG: /authenticate");
  const email = response.locals.params.email;
  const password = response.locals.params.password;

  const users = db.query("SELECT * FROM users WHERE email=?").all(email);
  let userId = "";

  if (users.length > 0) {
    // Check if the submitted password is correct
    const [salt, existingPassword] = [users[0].salt, users[0].password];
    const identical = await Bun.password.verify(password + salt, existingPassword);
    if (!identical) {
      response.json({ error: true, message: "Wrong password" });
      return;
    }
    userId = users[0].userId;
  } else {
    // Create a new user account
    const salt = randomUUIDv7();
    const hashed = await Bun.password.hash(password + salt);
    const sql = `INSERT INTO users (email, password, salt) VALUES (?, ?, ?)`;
    db.query(sql).run(email, hashed, salt);
    userId = db.query("SELECT last_insert_rowid()").all()[0] as string;
  }

  // Return a json web token that expires in 100 days
  sign({ userId }, process.env.JWT_SECRET, { expiresIn: "100D" },
    (err, token) => response.json(err === null ? { error: false, token } : { error: true })
  );
});

app.get("/userData", (_request, response) => {
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
  const deleteSuccess = result.changes == 1;
  const message = deleteSuccess ? undefined : "Exercise doesn't exist";
  response.json({ error: !deleteSuccess, message });
});

app.all("*", (_request, response) => { response.send("404"); });

app.listen(8080, () => console.log("Listening at http://localhost:8080"));
