import express from "express";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the USDA Food Central API to get information for various food results
async function searchFoodFromUSDA(query: string, page: number): Promise<object> {
  const key = process.env.USDA_API_KEY;
  const url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${key}`;
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({ query: query, pageNumber: Math.max(1, page), pageSize: 10 }),
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    }
  });

  if (response.status != 200) {
    throw new Error("Uh oh, problem calling the USDA api");
  }

  const nutrientInfo = (nutrients: object[], id: number): string => {
    const nutrient = nutrients.filter((n) => n["nutrientId"] == id)[0];
    return `${nutrient["value"]} ${nutrient["unitName"].toLowerCase()}`;
  }

  let foods = [];
  const json = await response.json();
  for (const foodData of json["foods"]) {
    const nutrients = foodData["foodNutrients"];

    // NOTE: Macros are calculated from 100 g quantities of the food
    let servingSizes = [];
    for (const measure of foodData["foodMeasures"]) {
      const name = measure["disseminationText"];
      if (name == "Quantity not specified")
        continue;
      servingSizes.push({ name: name, weightInGrams: measure["gramWeight"] }); // TODO: how about liquids?
    }

    foods.push({
      name: foodData["description"],
      protein: nutrientInfo(nutrients, 1003),
      calories: nutrientInfo(nutrients, 1008),
      fat: nutrientInfo(nutrients, 1004),
      carbohydrates: nutrientInfo(nutrients, 1005),
      servingSizes: servingSizes
    });
  }

  return foods;
}

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

const foodData = [
  { servings: 1, name: "Food item 1", calories: 100 },
  { servings: 2, name: "Food item 2", calories: 120 },
  { servings: 2, name: "Food item 3", calories: 300 },
  { servings: 1, name: "Food item 4", calories: 100 },
  { servings: 4, name: "Food item 5", calories: 50 },
  { servings: 4, name: "Food item 6", calories: 50 },
];

const exercises = [
  { name: "Push ups", sets: 3, reps: 20, weight: 10 },
  { name: "Jump rope", workDuration: 40, restDuration: 20, rounds: 15 },
  { name: "Pull ups", sets: 2, reps: 15, weight: 0 },
  { name: "Squats", sets: 5, reps: 50, weight: 20 },
];

app.get("/user_data", (_request, response) => {
  console.log("LOG: getting user data");
  response.json({ success: true, weightEntries: weightData, foodLog: foodData, exercises: exercises });
});

app.get("/find_food", (request, response) => {
  const [query, page] = [request.query.query, Number(request.query.page)];
  if (typeof query != "string" || isNaN(page)) {
    response.send({ success: false, message: "Malformed request" });
    return;
  }
  // TODO: the issue with the USDA api is that it's too specific.
  //       like, the data is good, but the values aren't something a user would want to select
  //       we should look into Open Food Facts
  //       I think we should use both the usda api to get whole foods and Open Food Facts
  //       to find processed food.
  searchFoodFromUSDA(query, page)
    .then((data) => response.send({ success: true, foods: data }));
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