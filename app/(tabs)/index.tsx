import { useState } from "react";

import { Container, Row } from "@/components/containers";
import { NumericInput } from "@/components/inputs";
import { ThemedText } from "@/components/text";
import Graph from "@/components/graph";
import Selection from "@/components/selection";

export default function HomeScreen() {
  const [selection, setSelection] = useState(0);
  const [weight, setWeight] = useState(0);

  // Dummy data
  const data = [
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

  return (
    <Container>
      <Row>
        <NumericInput setData={setWeight} prefix={""} suffix={""} />
        <ThemedText header text={"lbs"} />
      </Row>

      <Selection
        options={["Daily", "Weekly", "Full"]}
        selection={selection}
        setSelection={setSelection}
      />

      <Graph data={data} />
    </Container>
  );
}
