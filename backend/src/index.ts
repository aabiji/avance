import express from "express";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// NOTE: these values are hardcoded for now!
const weightData: Record<string, number> = {
  "2024-12-11": 142.2,
  "2024-12-12": 140.9,
  "2024-12-13": 142.2,
  "2024-12-14": 139.3,
  "2024-12-16": 141.4,
  "2024-12-17": 142.0,
  "2024-12-18": 140.4,
  "2024-12-19": 139.2,
  "2024-12-20": 138.8,
  "2024-12-21": 139.1,
  "2024-12-22": 142.0,
  "2024-12-23": 140.1,
  "2024-12-24": 142.9,
  "2024-12-25": 142.6,
  "2024-12-26": 144.2,
  "2024-12-27": 141.5,
  "2024-12-28": 140.4,
  "2024-12-29": 141.3,
  "2024-12-30": 140.4,
  "2024-12-31": 140.4,
  "2025-01-01": 142.0,
  "2025-01-02": 140.7,
  "2025-01-03": 140.3,
  "2025-01-04": 139.8,
  "2025-01-05": 139.9,
  "2025-01-06": 141.6,
  "2025-01-07": 139.3,
  "2025-01-08": 140.8,
  "2025-01-09": 139.4,
  "2025-01-10": 138.9,
  "2025-01-11": 140.3,
};

const exercises = [
  { name: "Push ups", sets: 3, reps: 20, weight: 10 },
  { name: "Jump rope", workDuration: 40, restDuration: 20, rounds: 15 },
  { name: "Pull ups", sets: 2, reps: 15, weight: 0 },
  { name: "Squats", sets: 5, reps: 50, weight: 20 },
];

app.get("/user_data", (_request, response) => {
  console.log("LOG: getting user data");
  response.json({ success: true, weightEntries: weightData, exercises: exercises });
});

app.post("/update_exercise", (request, response) => {
  console.log("LOG: updating exercise", request.body);
  response.json({ success: true });
});

app.delete("/delete_exercise", (request, response) => {
  console.log("LOG: deleting exercise", request.body);
  response.json({ success: true });
});

app.listen(8080, () => console.log("Backend listening on port 8080"));