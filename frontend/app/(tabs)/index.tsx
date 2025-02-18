import { useState, useEffect } from "react";
import { View } from "react-native";

import { Container } from "@/components/containers";
import { DataPoint, Graph } from "@/components/graph";
import { NumericInput } from "@/components/inputs";
import Selection from "@/components/selection";
import { fontSize, getColors } from "@/components/theme";

import useStorage from "@/lib/storage";

import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import advancedFormat from "dayjs/plugin/advancedFormat";
dayjs.extend(advancedFormat);
dayjs.extend(weekOfYear);

enum GraphView { Daily, Weekly, Full }
const strEnumMembers = <T extends object>(enumType: T) =>
  Object.keys(enumType).filter((member) => isNaN(Number(member)));

type WeightEntries = Record<string, number>;

// Group a list of dates into groups, where each group
// contains dates that fall within the same week.
// The dates must be already be sorted in ascending order.
function groupDatesByWeek(dates: string[]): string[][] {
  let weeks = [];
  let currentWeek = [dates[0]];

  for (let i = 1; i < dates.length; i++) {
    const current = dates[i];
    const previous = currentWeek[currentWeek.length - 1];

    if (dayjs(current).week() == dayjs(previous).week()) {
      currentWeek.push(current);
      continue;
    }

    // Move on to the next week
    weeks.push(currentWeek);
    currentWeek = [current];
  }

  weeks.push(currentWeek);
  return weeks;
}

// Aggregate daily weight entries into weekly averages
function weeklyWeights(entries: WeightEntries): WeightEntries {
  const weeks = groupDatesByWeek(Object.keys(entries));
  let newEntries: WeightEntries = {};

  for (const week of weeks) {
    const weightValues = week.map((day) => entries[day]);
    const sum = weightValues.reduce((a, b) => a + b);
    const avg = sum / weightValues.length;
    newEntries[week[0].toString()] = Math.round(avg * 10) / 10;
  }

  return newEntries;
}

// Get the last recorded weight
function getLastWeight(entries: WeightEntries): number {
  const sortedDates = Object.keys(entries)
    .sort((a, b) => (new Date(a)).valueOf() - (new Date(b)).valueOf());
  const last = sortedDates[sortedDates.length - 1];
  return last === undefined ? 0 : entries[last];
}

// Map our data into the data format the graph expects
function prepareData(entries: WeightEntries): DataPoint[] {
  const sortedDates = Object.keys(entries)
    .sort((a, b) => (new Date(a)).valueOf() - (new Date(b)).valueOf());
  let graphData = [];
  for (const day of sortedDates) {
    const date = dayjs(day);
    graphData.push({
      value: entries[day],
      label: date.format("MMM D"),
      info: date.format("MMM Do YYYY"),
    });
  }
  return graphData;
}

export default function HomeScreen() {
  const [view, setView] = useState<GraphView>(GraphView.Daily);
  const [weight, setWeight] = useState<number>(0);
  const [graphData, setGraphData] = useState<DataPoint[]>([]);

  const [token, _setToken] = useStorage("token", undefined);
  const [requestQueue, setRequestQueue] = useStorage("requestQueue", []);
  const [weightEntries, setWeightEntries] = useStorage("weightEntries", {});

  // Temporary function to get random weight entries
  const randomDataset = (n: number) => {
    const entries = {};
    let date = dayjs(new Date(new Date().valueOf() - Math.random() * (1e+12)));
    for (let i = 0; i < n; i++) {
      const randomNum = Math.round(100 + (Math.random() * 50));
      entries[date.format("YYYY-MM-DD")] = randomNum;
      date = date.add(1, 'd');
    }
    return entries;
  };

  // Update the graph data when the component loads
  useEffect(() => {
    setGraphData(prepareData(weightEntries));
    setWeight(getLastWeight(weightEntries));
  }, []);

  // Update the graph rendering when the inputted weight value changes
  useEffect(() => {
    let copy = { ...weightEntries };
    const today = dayjs().format("YYYY-MM-DD");
    copy[today] = Number(weight);
    setWeightEntries(copy);
    setGraphData(prepareData(copy));
  }, [weight]);

  // Change the graph's data points based
  // on the way we choose to view the graph
  useEffect(() => {
    const data = view == GraphView.Weekly
      ? weeklyWeights(weightEntries) : weightEntries;
    setGraphData(prepareData(data));
  }, [view]);

  const updateRequest = () => {
    const request = {
      method: "POST",
      endpoint: "/setWeightEntry",
      body: {
        date: dayjs().format("YYYY-MM-DD"),
        weight: Number(weight)
      },
      token,
    };
    setRequestQueue([...requestQueue, request]);
  };

  return (
    <Container background style={{ flexDirection: "column" }}>
      <View style={{ alignItems: "center", justifyContent: "center", height: "40%" }}>
        <Container background row>
          <NumericInput
            value={`${weight}`}
            setValue={setWeight}
            prefix={""}
            suffix={"lbs"}
            loseFocus={updateRequest}
            style={{
              fontWeight: "bold",
              fontSize: fontSize["800"],
              color: getColors().text["950"],
            }}
          />
        </Container>
        <Selection
          options={strEnumMembers(GraphView)}
          selection={view}
          setSelection={setView}
          style={{ marginTop: "10%" }}
        />
      </View>
      <View style={{ height: "50%", width: "100%" }}>
        <Graph data={prepareData(randomDataset(100))} fitToWidth={view == GraphView.Full} />
      </View>
    </Container>
  );
}