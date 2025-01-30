import { ReactNode, useLayoutEffect, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Circle, Line, Svg } from "react-native-svg";

import getColors, { fontSize } from "@/components/theme";

export interface GraphPoint {
  value: number;
  label: string;
}

interface GraphProps {
  data: GraphPoint[];
  showEverything: boolean;
}

// TODO: handle showEverything
// TODO: show info on data point on hover
// TODO: fix weekly grouping
export function Graph({ data, showEverything }: GraphProps) {
  const [elements, setElements] = useState<ReactNode[]>([]);
  const [verticalLabels, setVerticalLabels] = useState<ReactNode[]>([]);
  const [horizontalLabels, setHorizontalLabels] = useState<ReactNode[]>([]);

  const [width, spacing] = [data.length * 25, 25];
  const [height, setHeight] = useState(0);
  const view = useRef(null);

  // Find the lowest and the highest value in the data. Extrapolate the
  // low and high out so that the graph has a bit of padding at both ends.
  let lowest = Math.min(...data.map((point) => point.value));
  let highest = Math.max(...data.map((point) => point.value));
  const range = highest - lowest;
  lowest -= Math.round(range * 0.1);
  highest += Math.round(range * 0.1);

  // Map a value from an input range (x1 to y1) to an output range (x2 to y2)
  const map = (v: number, x1: number, y1: number, x2: number, y2: number) =>
    x2 + ((y2 - x2) / (y1 - x1)) * (v - x1);

  const getXY = (index: number, height: number) =>
    [index * spacing, map(data[index].value, lowest, highest, 0, height)];

  useLayoutEffect(() => {
    const height = view.current.unstable_getBoundingClientRect().height;
    let elements = [];
    let xLabels = [];
    let yLabels = [];
    let key = 0;

    // Add the points, their labels and the lines connecting them
    for (let i = 0; i < data.length; i++) {
      const [x, y] = getXY(i, height);
      elements.push(
        <Circle
          key={++key}
          cx={x} cy={y} r="3"
          fill={getColors().accent["500"]}
        />);

      // TODO: align the labels with the points and improve the way this looks
      xLabels.push(
        <View key={++key} style={{ width: spacing }}>
          <Text style={{ transform: "rotate(45deg)", fontSize: fontSize["100"] }}>
            {data[i].label}
          </Text>
        </View>
      );

      if (i + 1 < data.length) {
        const [nextX, nextY] = getXY(i + 1, height);
        elements.push(
          <Line
            key={++key}
            x1={x} y1={y} x2={nextX} y2={nextY}
            stroke={getColors().accent["600"]} />
        );
      }
    }

    // Add the horizontal axis
    elements.push(
      <Line
        key={++key} stroke="#000000" strokeWidth="5"
        x1={0} y1={height} x2={width} y2={height}
      />
    );

    // Add the vertical labels
    for (let i = 0; i < 10; i++) {
      const y = map(i, 0, 10, 0, height);
      const value = map(i, 0, 10, highest, lowest);
      yLabels.push(
        <Text
          key={++key}
          style={{ position: "absolute", top: y, fontSize: fontSize["100"] }}>
          {value.toFixed(1)} lbs
        </Text>
      );
    }

    setHeight(height);
    setElements(elements);
    setVerticalLabels(yLabels);
    setHorizontalLabels(xLabels);
  }, [data]);

  return (
    <View style={{ flexDirection: "row", height: "100%" }}>
      <View style={{ position: "relative", width: 50 }}>{verticalLabels}</View>
      <View style={{ height: "100%", width: 1, backgroundColor: "#000000" }}></View>

      <ScrollView horizontal ref={view} >
        <View style={{ flexDirection: "column", width: width }}>
          <Svg fill="#ff0000" width={width} height={height}>{elements}</Svg>
          <View style={{ flexDirection: "row", marginTop: -20, padding: 0 }}>
            {horizontalLabels}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default Graph;
