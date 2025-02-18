import express, {
  type Request, type Response, type NextFunction
} from 'express';
import { sign, verify } from "jsonwebtoken";
import { SQL, randomUUIDv7 } from "bun";
import { z } from "zod";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const JWT_SECRET = await Bun.file("/run/secrets/jwt_secret").text();
const pw = await Bun.file("/run/secrets/postgres_password").text();
const sql = new SQL(`postgres://postgres:${pw}@database:5432/avance-database`);

async function setupDatabase(sql: SQL) {
  sql.connect().catch(() => {
    console.log("Couldn't connect to the database :(");
    process.exit(1);
  });

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      userId SERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      password TEXT NOT NULL,
      salt TEXT NOT NULL
    );
    `
  await sql`
    CREATE TABLE IF NOT EXISTS weightEntries (
      userId INTEGER NOT NULL,
      date TEXT NOT NULL,
      weight INTEGER NOT NULL,
      timestamp BIGINT NOT NULL,
      UNIQUE (userId, date)
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS strengthExercises (
      userId INTEGER NOT NULL,
      name TEXT NOT NULL,
      weekDay INTEGER NOT NULL,
      reps INTEGER NOT NULL,
      sets INTEGER NOT NULL,
      weight INTEGER NOT NULL,
      timestamp BIGINT NOT NULL,
      UNIQUE (userId, name, weekDay)
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS hiitExercises (
      userId INTEGER NOT NULL,
      name TEXT NOT NULL,
      weekDay INTEGER NOT NULL,
      workDuration INTEGER NOT NULL,
      restDuration INTEGER NOT NULL,
      rounds INTEGER NOT NULL,
      timestamp BIGINT NOT NULL,
      UNIQUE (userId, name, weekDay)
    );
  `;
}

// Get the schema that describes the endpoint's expected request body
function getSchema(endpoint: string) {
  const str = z.string().min(1).max(250);
  const strNum = z.string().regex(/^-?\d+$/).transform(Number);
  const num = z.number().int().finite();
  const numeric = strNum.or(num);

  const schemas: Record<string, z.ZodObject<any>> = {
    "/authenticate": z.object({
      email: str.email(),
      password: str,
    }),
    "/userData": z.object({ startTimestamp: numeric }),
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

function validateRequest(
  request: Request,
  response: Response,
  next: NextFunction
) {
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

  // Verify the userId that's taken from the
  // json web token in the request header
  const auth = request.headers["authorization"];
  if (auth === undefined || auth.split(" ").length != 2) {
    response.json({ error: true, message: "Invalid Authorization header" });
    return;
  }
  const token = auth.split(" ")[1] as string;

  verify(token, JWT_SECRET, async (error, decoded) => {
    if (error != null || decoded.userId === undefined) {
      response.json({ error: true, message: "Invalid token" });
      return;
    }

    const values =
      await sql`SELECT * FROM users WHERE userId=${decoded.userId}`;
    if (values.length != 1) {
      response.json({ error: true, message: "User not found" });
      return;
    }

    response.locals.params = {
      ...response.locals.params,
      userId: decoded.userId
    };
    next();
  });
}

app.use(validateRequest);

// Verifies a user's account if it already exists, or create a new one
app.post("/authenticate", async (_request, response) => {
  console.log("LOG: /authenticate");
  const email = response.locals.params.email;
  const password = response.locals.params.password;

  const users = await sql`SELECT * FROM users WHERE email=${email};`;
  let userId = "";

  if (users.length > 0) {
    // Check if the submitted password is correct
    const [salt, existingPassword] = [users[0].salt, users[0].password];
    const identical = await Bun.password.verify(password + salt, existingPassword);
    if (!identical) {
      response.json({ error: true, message: "Wrong password" });
      return;
    }
    userId = users[0].userid;
  } else {
    // Create a new user account
    const salt = randomUUIDv7();
    const hashed = await Bun.password.hash(password + salt);
    const results = await sql`
      INSERT INTO users (email, password, salt)
      VALUES (${email}, ${hashed}, ${salt})
      RETURNING userId;`;
    userId = results[0].userid;
  }

  // Return a json web token that expires in 100 days
  sign({ userId }, JWT_SECRET, { expiresIn: "100Days" },
    (err, token) =>
      response.json(err === null ? { error: false, token } : { error: true })
  );
});

app.post("/userData", async (_request, response) => {
  console.log("LOG: /userData");
  const userId = Number(response.locals.params.userId);
  const start = response.locals.params.startTimestamp ?? -1;

  const entries = await sql`
    SELECT * FROM weightEntries
    WHERE userId = ${userId} AND timestamp >= ${start};`;
  let weightEntries: Record<string, number> = {};
  for (const entry of entries) {
    weightEntries[entry.date] = entry.weight;
  }

  let exercises = [];
  for (let i = 0; i < 2; i++) {
    const values = i == 0
      ? await sql`
          SELECT * FROM strengthExercises
          WHERE userId = ${userId} AND timestamp >= ${start};`
      : await sql`
          SELECT * FROM hiitExercises
          WHERE userId = ${userId} AND timestamp >= ${start};`;
    for (const value of values) {
      delete value["userId"];
      delete value["timestamp"];
      exercises.push(value);
    }
  }

  response.json({ error: false, weightEntries, exercises });
});

app.post("/setWeightEntry", async (_request, response) => {
  console.log("LOG: /setWeightEntry");
  const { userId, date, weight } = response.locals.params;
  await sql`
    INSERT INTO weightEntries
    (userId, date, weight, timestamp)
    VALUES (${userId},${date},${weight},${Date.now()})
    ON CONFLICT (userId, date)
    DO UPDATE SET
      weight = EXCLUDED.weight,
      timestamp = EXCLUDED.timestamp;`;
  response.json({ error: false });
});

app.post("/updateExercise", async (_request, response) => {
  console.log("LOG: /updateExercise");
  const { userId, weekDay, hiit, strength } = response.locals.params;
  const timestamp = Date.now();
  if (hiit !== undefined) {
    await sql`
      INSERT INTO hiitExercises
      (userId, name, weekDay, workDuration, restDuration, rounds, timestamp)
      VALUES (
        ${userId}, ${hiit.name}, ${weekDay},
        ${hiit.workDuration}, ${hiit.restDuration},
        ${hiit.rounds}, ${timestamp}
      )
      ON CONFLICT (userId, name, weekDay)
      DO UPDATE SET
        weekDay = EXCLUDED.weekDay,
        workDuration = EXCLUDED.workDuration,
        restDuration = EXCLUDED.restDuration,
        rounds = EXCLUDED.rounds,
        timestamp = EXCLUDED.timestamp;
    `;
  } else {
    await sql`
      INSERT INTO strengthExercises
      (userId, name, weekDay, reps, sets, weight, timestamp)
      VALUES (
        ${userId}, ${strength.name}, ${weekDay},
        ${strength.reps}, ${strength.sets},
        ${strength.weight}, ${timestamp}
      )
      ON CONFLICT (userId, name, weekDay)
      DO UPDATE SET
        weekDay = EXCLUDED.weekDay,
        reps = EXCLUDED.reps,
        sets = EXCLUDED.sets,
        weight = EXCLUDED.weight,
        timestamp = EXCLUDED.timestamp;
    `;
  }
 response.json({ error: false });
});

app.delete("/deleteExercise", async (_request, response) => {
  console.log("LOG: /deleteExercise");
  const { userId, name, isHiit } = response.locals.params;
  const result = isHiit
    ? await sql`
        DELETE FROM hiitExercises
        WHERE userId=${userId} AND name=${name}`
    : await sql`
        DELETE FROM strengthExercises
        WHERE userId=${userId} AND name=${name}`;
  const deleteSuccess = result.changes == 1;
  const message = deleteSuccess ? undefined : "Exercise doesn't exist";
  response.json({ error: !deleteSuccess, message });
});

app.all("*", (_request, response) => { response.send("404"); });

app.listen(8080, async () => {
  setupDatabase(sql);
  console.log("Listening at http://localhost:8080");
});