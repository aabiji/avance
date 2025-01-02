import { useState, useEffect } from "react";

import { View } from "react-native";
import { lineDataItem } from "react-native-gifted-charts";

import { fontSize, getTheme } from "@/components/theme";
import { Container } from "@/components/containers";
import { NumericInput } from "@/components/inputs";
import Selection from "@/components/selection";
import Graph from "@/components/graph";

import { today, formatDate, groupDatesByWeek } from "@/lib/date";
import request from "@/lib/http";

enum GraphView { Daily, Weekly, Full }
const enumToString = <T extends object>(enumType: T) =>
  Object.keys(enumType).filter((member) => isNaN(Number(member)));

type WeightEntries = Record<string, number>;

// Aggregate daily weight entries into weekly averages
function weeklyWeights(entries: WeightEntries): WeightEntries {
  const dates = Object.keys(entries).map((date) => new Date(date));
  const weeks = groupDatesByWeek(dates);
  let newEntries: WeightEntries = {};

  for (const week of weeks) {
    const weightValues = week.map((day) => entries[formatDate(day, true)]);

    const sum = weightValues.reduce((a, b) => a + b);
    const avg = sum / weightValues.length;

    let weekStart = formatDate(week[0], true);
    newEntries[weekStart] = Math.round(avg * 10) / 10;
  }

  return newEntries;
}

// Map our data into the data format the graph expects
function prepareData(entries: WeightEntries): lineDataItem[] {
  let graphData = [];
  for (const day in entries) {
    graphData.push({ label: day, value: entries[day] });
  }
  return graphData;
}

// Get the last recorded weight
function getLastWeight(entries: WeightEntries): number {
  const days = Object.keys(entries);
  const last = days[days.length - 1];
  return entries[last];
}

export default function HomeScreen() {
  const [view, setView] = useState<GraphView>(GraphView.Daily);
  const [weight, setWeight] = useState<number>(0);
  const [entries, setEntries] = useState<WeightEntries>({});
  const [graphData, setGraphData] = useState<lineDataItem[]>([]);

  // Load the weight data
  const init = (data: WeightEntries) => {
    setEntries(data);
    setGraphData(prepareData(data));
    setWeight(getLastWeight(data));
  };

  useEffect(() => {
    request({
      method: "GET",
      endpoint: "/get_user_data",
      onError: (msg: unknown) => console.log("ERROR", msg),
      handler: (response: object) => init(response["weightData"] as WeightEntries),
    });
  }, []);

  // Update the graph rendering when the inputted weight value changes
  useEffect(() => {
    let copy = { ...entries };
    copy[today()] = Number(weight);
    setEntries(copy);
    setGraphData(prepareData(copy));
  }, [weight]);

  // Change the graph's data points based
  // on the way we choose to view the graph
  useEffect(() => {
    const data = view == GraphView.Weekly ? weeklyWeights(entries) : entries;
    setGraphData(prepareData(data));
  }, [view]);

  return (
    <Container>
      <View style={{ height: "2%" }}></View>
      <Container row>
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
      </Container>
      <View style={{ height: "2%" }}></View>
      <Selection
        options={enumToString(GraphView)}
        selection={view}
        setSelection={setView}
      />
      <View style={{ height: "2%" }}></View>
      <Graph data={graphData} showEverything={view != GraphView.Daily} />
    </Container>
  );
}
