import { useState, useEffect } from "react";

import { View } from "react-native";
import { lineDataItem } from "react-native-gifted-charts";

import { Container } from "@/components/containers";
import Graph from "@/components/graph";
import { NumericInput } from "@/components/inputs";
import Selection from "@/components/selection";
import { ThemedText } from "@/components/text";
import { fontSize, getColors } from "@/components/theme";

import { today, formatDate, groupDatesByWeek } from "@/lib/date";
import request from "@/lib/http";
import useStorage from "@/lib/storage";

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

// Get the last recorded weight
function getLastWeight(entries: WeightEntries): number {
  const days = Object.keys(entries);
  const last = days[days.length - 1];
  return entries[last];
}

// Map our data into the data format the graph expects
function prepareData(entries: WeightEntries): lineDataItem[] {
  let graphData = [];
  for (const day in entries) {
    graphData.push({ label: day, value: entries[day] });
  }
  return graphData;
}

export default function HomeScreen() {
  const [view, setView] = useState<GraphView>(GraphView.Daily);
  const [weight, setWeight] = useState<number>(0);
  const [graphData, setGraphData] = useState<lineDataItem[]>([]);

  const [weightEntries, setWeightEntries] = useStorage("weightEntries", {});
  const [_foodLog, setFoodLog] = useStorage("foodLog", []);
  const [_exercises, setExercises] = useStorage("exercises", []);

  const [loaded, setLoaded] = useState(false);

  // Update the user data that's stored locally
  // TODO: Ideally, this should be done in the splash screen
  // TODO: call the update_user_data when the app is out of focus
  //       if our previous http request failed
  useEffect(() => {
    request({
      method: "GET", endpoint: "/user_data",

      // Don't do anything when we error trying to call the api.
      // For example, in the event that the user is disconnected from the
      // internet, the app will just fallback on the data stored locally.
      onError: (_msg: unknown) => { },

      handler: (response: object) => {
        // Put the user data in the local storage
        setWeightEntries(response["weightEntries"]);
        setFoodLog(response["foodLog"]);
        setExercises(response["exercises"]);

        // Set the data for this component
        setGraphData(prepareData(weightEntries));
        setWeight(getLastWeight(weightEntries));

        setLoaded(true);
      }
    });
  }, []);

  // Update the graph rendering when the inputted weight value changes
  useEffect(() => {
    let copy = { ...weightEntries };
    copy[today()] = Number(weight);
    setWeightEntries(copy);
    setGraphData(prepareData(copy));
  }, [weight]);

  // Change the graph's data points based
  // on the way we choose to view the graph
  useEffect(() => {
    const data = view == GraphView.Weekly ? weeklyWeights(weightEntries) : weightEntries;
    setGraphData(prepareData(data));
  }, [view]);

  if (!loaded) {
    return (
      <Container>
        <ThemedText text={"Loading..."} />
      </Container>
    )
  }

  return (
    <Container style={{ flexDirection: "column" }}>
      <View style={{ alignItems: "center", justifyContent: "center", height: "40%" }}>
        <Container row>
          <NumericInput
            value={`${weight}`}
            setValue={setWeight}
            prefix={""}
            suffix={"lbs"}
            style={{
              fontWeight: "bold",
              fontSize: fontSize.big,
              color: getColors().text["100"],
            }}
          />
        </Container>
        <Selection
          options={enumToString(GraphView)}
          selection={view}
          setSelection={setView}
          style={{ marginTop: "10%" }}
        />
      </View>
      <Graph data={graphData} showEverything={view != GraphView.Daily} />
    </Container>
  );
}
