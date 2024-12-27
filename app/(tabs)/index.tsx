import { useState, useEffect, useMemo } from "react";

import { View } from "react-native";
import { Container, Row } from "@/components/containers";
import { NumericInput } from "@/components/inputs";
import Graph from "@/components/graph";
import Selection from "@/components/selection";
import { fontSize, getTheme } from "@/components/theme";

const today = () => {
  const options = { month: "short", day: "numeric", year: "numeric" };
  return new Date().toLocaleString("default", options);
};

export default function HomeScreen() {
  const [selection, setSelection] = useState(0);

  let data = [
    { value: 142.2, label: "Dec 11" },
    { value: 140.9, label: "Dec 12" },
    { value: 142.2, label: "Dec 13" },
    { value: 139.3, label: "Dec 14" },
    { value: 141.9, label: "Dec 16" },
    { value: 142.0, label: "Dec 17" },
    { value: 140.4, label: "Dec 18" },
    { value: 139.2, label: "Dec 19" },
    { value: 138.8, label: "Dec 20" },
    { value: 139.1, label: "Dec 21" },
    { value: 142.0, label: "Dec 22" },
    { value: 140.1, label: "Dec 23" },
    { value: 142.9, label: "Dec 24" },
  ];
  const yesterday = data[data.length - 1];
  const initialData = useMemo(() => {
    return [...data, { value: yesterday.value, label: today() }];
  }, [data]);
  const [entries, setEntries] = useState(initialData);
  const [weight, setWeight] = useState(yesterday.value);

  useEffect(() => {
    const data = [...entries];
    data[data.length - 1] = { value: Number(weight), label: today() };
    setEntries(data);
  }, [weight]);

  return (
    <Container>
      <View style={{ height: "2%" }}></View>
      <Row>
        <NumericInput
          value={`${weight}`}
          setData={setWeight}
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
        options={["Daily", "Weekly", "Full"]}
        selection={selection}
        setSelection={setSelection}
      />
      <View style={{ height: "2%" }}></View>
      <Graph data={entries} />
    </Container>
  );
}
