// NOTE: This is just a mock backend for now
import express from "express";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
};

app.get("/get_user_data", (_request, response) => {
  response.json({ weightData: weightData });
});

app.listen(8080, () => console.log("Backend listening on port 8080"));
