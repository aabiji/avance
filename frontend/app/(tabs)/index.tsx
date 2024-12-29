import { useState, useEffect } from "react";

import { View } from "react-native";
import { lineDataItem } from "react-native-gifted-charts";

import { fontSize, getTheme } from "@/components/theme";
import { Container, Row } from "@/components/containers";
import { NumericInput } from "@/components/inputs";
import Selection from "@/components/selection";
import Graph from "@/components/graph";

import { today, formatDate, groupDatesByWeek } from "@/lib/date";
import { request } from "@/lib/http";

enum GraphView { Daily, Weekly, Full }

function getWeightData(): [Record<string, number>, lineDataItem[]] {
  // Should we set user data when the app is no longer active???
  useEffect(() => {
    request({
      method: "GET",
      endpoint: "/get_user_data",
      handler: (response: object) => console.log("DATA", response),
      onError: (msg: unknown) => console.log("ERROR", msg),
    });
  }, []);

  let data: Record<string, number> = {
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
  };

  // Map our data into the graph's data format
  let graphData = [];
  for (const key in data) {
    graphData.push({ label: key, value: data[key] });
  }

  return [data, graphData];
};

// Average the weight values into weekly averages
// and return a list of new graph data points
function averageWeightsByWeek(data: Record<string, number>): lineDataItem[] {
  const dates = Object.keys(data).map((key) => new Date(key));
  const weeks = groupDatesByWeek(dates);

  let newGraphData = [];
  for (const week of weeks) {
    const weightValues = week.map((day) => data[formatDate(day, true)]);

    const sum = weightValues.reduce((a, b) => a + b);
    const avg = sum / weightValues.length;
    const rounded = Math.round(avg * 10) / 10; // Round to 1 decimal place

    const dataPoint = { label: formatDate(week[0], true), value: rounded };
    newGraphData.push(dataPoint);
  }
  return newGraphData;
}

export default function HomeScreen() {
  const [view, setView] = useState(GraphView.Daily);
  const selections = Object.keys(GraphView).slice(3);

  // Load the weight data
  const [data, preparedData] = getWeightData();
  const [graphData, setGraphData] = useState(preparedData);

  // Default weight entry for today is yesterday's weight entry
  const yesterday = preparedData[preparedData.length - 1];
  const [weight, setWeight] = useState(yesterday.value);

  // Update the graph rendering when the inputted weight value changes
  useEffect(() => {
    // Replace the last element in the array
    const dataPoint = { value: Number(weight), label: today() };
    const array = graphData.slice(0, graphData.length - 1);
    setGraphData([...array, dataPoint]);
  }, [weight]);

  // Change the graph's data points based
  // on the way we choose to view the graph
  useEffect(() => {
    if (view == GraphView.Daily || view == GraphView.Full)
      setGraphData(preparedData);
    else
      setGraphData(averageWeightsByWeek(data));
  }, [view]);

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
        selection={view}
        setSelection={setView}
      />
      <View style={{ height: "2%" }}></View>
      <Graph data={graphData} showEverything={view != GraphView.Daily} />
    </Container>
  );
}
