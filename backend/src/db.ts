import { Database } from "bun:sqlite";

/*
CREATE DATABASE avance_db;

CREATE TABLE weight_entries (
  userId INTEGER NOT NULL,
  date TEXT NOT NULL,
  weight INTEGER NOT NULL
);

SeLECT * FROM weight_entries WHERE userId=? ORDER BY date;

TODO: how to set the id for each type of exercise
      we can't just make each id an autoincrement primary key
      because then we'd have exercises with the same idea across both tables
      Should we use a uuid?
      Should we use a sequence table?

CREATE TABLE strength_exercise (
  id INTEGER NOT NULL,
  userId INTEGER NOT NULL,
  name TEXT NOT NULL,
  reps INTEGER NOT NULL,
  sets INTEGER NOT NULL,
  weight INTEGER NOT NULL,
);

CREATE TABLE hiit_exercise (
  id INTEGER NOT NULL,
  userId INTEGER NOT NULL,
  name TEXT NOT NULL,
  workDuration INTEGER NOT NULL,
  restDuration INTEGER NOT NULL,
  rounds INTEGER NOT NULL,
);

CREATE TABLE user_info ( userId INTEGER PRIMARY KEY );
*/

const db = new Database("db.sqlite");
