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

// TODO: show info on data point on hover
// TODO: fix weekly grouping
export function Graph({ data, showEverything }: GraphProps) {
  const [elements, setElements] = useState<ReactNode[]>([]);
  const [verticalLabels, setVerticalLabels] = useState<ReactNode[]>([]);
  const [horizontalLabels, setHorizontalLabels] = useState<ReactNode[]>([]);

  const view = useRef(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

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

  useLayoutEffect(() => {
    const realWidth = view.current.unstable_getBoundingClientRect().width;
    const spacing = showEverything ? realWidth / data.length : 45;
    const width = showEverything ? realWidth : data.length * spacing;
    const realHeight = view.current.unstable_getBoundingClientRect().height;
    const height = realHeight - fontSize["100"] * 2; // Make space for horizontal labels

    const labelInterval = showEverything ? 4 : 1;
    let labelCount = 0;

    let elements = [];
    let xLabels = [];
    let yLabels = [];
    let key = 0;

    // Add the vertical labels
    for (let i = 0; i < 10; i++) {
      const y = map(i, 0, 10, 0, height);
      const value = map(i, 0, 10, highest, lowest);
      yLabels.push(
        <Text
          key={++key}
          style={{ position: "absolute", top: y, fontSize: fontSize["100"] }}>
          {value.toFixed(1)}
        </Text>
      );
    }

    // Add the horizontal axis
    elements.push(
      <Line
        key={++key} stroke="#000000" strokeWidth="3"
        x1={0} y1={height} x2={width} y2={height}
      />
    );

    for (let i = 0; i < data.length; i++) {
      // Add the point
      const x = i * spacing + spacing / 2;
      const y = map(data[i].value, lowest, highest, 0, height);
      elements.push(
        <Circle
          key={++key}
          cx={x} cy={y} r="3"
          fill={getColors().accent["500"]}
        />);

      // Add every nth horizontal label
      if (++labelCount == labelInterval) {
        xLabels.push(
          <View key={++key} style={{ width: spacing, position: "absolute", left: i * spacing }}>
            <Text style={{ fontSize: fontSize["100"], textAlign: "center" }}>
              {data[i].label}
            </Text>
          </View>
        );
        labelCount = 0;
      }

      // Add the line connecting this point to the next point
      if (i + 1 < data.length) {
        const nextX = (i + 1) * spacing + spacing / 2;
        const nextY = map(data[i + 1].value, lowest, highest, 0, height);
        elements.push(
          <Line
            key={++key}
            x1={x} y1={y} x2={nextX} y2={nextY}
            stroke={getColors().accent["600"]} />
        );
      }
    }

    setWidth(width);
    setHeight(height);
    setElements(elements);
    setVerticalLabels(yLabels);
    setHorizontalLabels(xLabels);
  }, [data]);

  return (
    <View style={{ flexDirection: "row", height: "100%" }}>
      <View style={{ position: "relative", width: 35 }}>{verticalLabels}</View>
      <View style={{ width: 1, backgroundColor: "#000000", height }}></View>

      <ScrollView horizontal ref={view}>
        <View style={{ flexDirection: "column", width: width }}>
          <Svg width={width} height={height}>{elements}</Svg>
          <View style={{ flexDirection: "row" }}>
            {horizontalLabels}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default Graph;
