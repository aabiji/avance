import { useState, useEffect } from "react";

import { View } from "react-native";
import { Container, Row } from "@/components/containers";
import { NumericInput } from "@/components/inputs";
import Graph from "@/components/graph";
import Selection from "@/components/selection";
import { fontSize, getTheme } from "@/components/theme";

enum GraphView {
  Daily,
  Weekly,
  Full,
}

// Get the current date in YYYY-MM-DD format
function today(): string {
  return new Date().toLocaleString("default").split(",")[0];
}

function formatDate(date: Date): string {
  const fmt = date.toLocaleString("default", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return fmt.replace(".", ""); // Remove the dot at the end of the month name
}

// Get the week number of a date according to ISO-8601
// A week number is an index going from 0 to 52 (or 53 if it's a leap year)
function getISOWeekNumber(date: Date): number {
  // Get the day index (0 - 6), accounting for the difference
  // in the first day of the week ISO-8601 says that Monday is
  // the first day of the week but Javascript says that Sunday
  // is the first day of the week
  const index = (date.getDay() + 6) % 7;

  // Get the date of the first thursday after today
  const nextThursday = new Date(date.setDate(date.getDate() - index + 3));

  // Get the date of the first thursday of the year
  const january1st = new Date(nextThursday.getFullYear(), 0, 1);
  const janIndex = (january1st.getDay() + 6) % 7;
  const firstThursday = new Date(
    january1st.setDate(january1st.getDate() + (3 - janIndex)),
  );

  // Get the week index
  const milisecondsPerWeek = 604800000;
  return 1 + Math.ceil((nextThursday - firstThursday) / milisecondsPerWeek);
}

const getWeightData = () => {
  return [
    { value: 142.2, label: "2024-12-11" },
    { value: 140.9, label: "2024-12-12" },
    { value: 142.2, label: "2024-12-13" },
    { value: 139.3, label: "2024-12-14" },
    { value: 141.9, label: "2024-12-16" },
    { value: 142.0, label: "2024-12-17" },
    { value: 140.4, label: "2024-12-18" },
    { value: 139.2, label: "2024-12-19" },
    { value: 138.8, label: "2024-12-20" },
    { value: 139.1, label: "2024-12-21" },
    { value: 142.0, label: "2024-12-22" },
    { value: 140.1, label: "2024-12-23" },
    { value: 142.9, label: "2024-12-24" },
  ];
};

export default function HomeScreen() {
  // Load the weight data
  const data = getWeightData();
  const yesterday = data[data.length - 1];
  const initialData = [...data, { value: yesterday.value, label: today() }];

  const [selection, setSelection] = useState(GraphView.Daily);
  const selections = [
    GraphView[GraphView.Daily],
    GraphView[GraphView.Weekly],
    GraphView[GraphView.Full],
  ];

  // Default weight entry for today is yesterday's weight entry
  const [weight, setWeight] = useState(yesterday.value);
  const [entries, setEntries] = useState(initialData);

  // Update the graph rendering when the inputted weight value changes
  useEffect(() => {
    const entry = { value: Number(weight), label: today() };
    setEntries([...entries.slice(0, entries.length - 1), entry]);
  }, [weight]);

  // Average the weight values into a list of weekly averages
  // FIXME: this is not entirely correct
  useEffect(() => {
    let averagedEntries = [];
    let [sum, count] = [0, 0];

    // Start with the first week
    let currentWeek = getISOWeekNumber(new Date(initialData[0].label));

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const week = getISOWeekNumber(new Date(entry.label));

      // If we've moved on the the next wek, record the
      // average weight values of the previous week
      if (week != currentWeek) {
        const average = sum / count;
        const previous = entries[i - 1];
        const newEntry = { label: previous.label, value: average };
        averagedEntries.push(newEntry);
        currentWeek = week;
      }

      // Add to the sum of weight values for the week
      count += 1;
      sum += entry.value;
    }

    console.log(averagedEntries);
    console.log(entries);
  }, [selection]);

  return (
    <Container>
      <View style={{ height: "2%" }}></View>
      <Row>
        <NumericInput
          value={`${weight}`}
          setValue={setWeight}
          prefix={""}
          suffix={"lbs"}
          style={{
            fontWeight: "bold",
            fontSize: fontSize.big,
            color: getTheme().text,
          }}
        />
      </Row>
      <View style={{ height: "2%" }}></View>
      <Selection
        options={selections}
        selection={selection}
        setSelection={setSelection}
      />
      <View style={{ height: "2%" }}></View>
      <Graph data={entries} showEverything={selection == GraphView.Full} />
    </Container>
  );
}
