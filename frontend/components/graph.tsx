import { ReactNode, useLayoutEffect, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Circle, Line, Svg } from "react-native-svg";

import getColors, { fontSize } from "@/components/theme";

export interface GraphPoint {
  value: number;
  label: string;
}

// Map a value from an input range (x1 to y1) to an output range (x2 to y2)
const map = (v: number, x1: number, y1: number, x2: number, y2: number) =>
  x2 + ((y2 - x2) / (y1 - x1)) * (v - x1);

// Find the lowest and the highest value in the data
function findExtremes(data: GraphPoint[]): [number, number] {
  const lowest = Math.min(...data.map((point) => point.value));
  const highest = Math.max(...data.map((point) => point.value));
  const amount = Math.round((highest - lowest) * 0.1);
  // Extrapolate the low and high out so that
  // the graph has a bit of padding at both ends
  return [lowest - amount, highest + amount];
}

function constructGraph(
  data: GraphPoint[], fitToWidth: boolean,
  width: number, height: number, spacing: number,
  addHover: (index: number, x: number, y: number) => void,
  removeHover: () => void
) {
  const labelInterval = fitToWidth ? 4 : 1;
  let labelCount = 0;
  let elements = [];
  let xLabels = [];
  let yLabels = [];
  let key = 0;
  const [lowest, highest] = findExtremes(data);

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
        key={++key} cx={x} cy={y} r="3"
        fill={getColors().accent["500"]}
      />);
    elements.push(
      <Circle
        key={++key} cx={x} cy={y} r="15" fill={"#00000000"}
        onPressIn={(event) =>
          addHover(i, event.nativeEvent.locationX, event.nativeEvent.locationY)}
        onPressOut={() => removeHover()}
      />);

    // Add every nth horizontal label
    if (++labelCount == labelInterval) {
      xLabels.push(
        <View
          key={++key}
          style={{ width: spacing, position: "absolute", left: i * spacing }}>
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

  return [elements, xLabels, yLabels];
}

function Info({ point, x, y }: { point: GraphPoint, x: number, y: number }) {
  return (
    <View
      style={{
        position: "absolute",
        left: x, top: y, padding: 10,
        backgroundColor: getColors().primary["500"]
      }}>
      <Text
        style={{
          fontSize: fontSize["200"],
          color: getColors().text["50"]
        }}>
        {point.info}
      </Text>
    </View>
  );
}

export function Graph({ data, fitToWidth }: { data: GraphPoint[], fitToWidth: boolean }) {
  const [elements, setElements] = useState<ReactNode[]>([]);
  const [verticalLabels, setVerticalLabels] = useState<ReactNode[]>([]);
  const [horizontalLabels, setHorizontalLabels] = useState<ReactNode[]>([]);
  const [hoveredElement, setHoveredElement] = useState<ReactNode>();

  const view = useRef(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);

  const handleScroll = (event) =>
    setScrollOffset(event.nativeEvent.contentOffset.x);

  const addHover = (index: number, x: number, y: number) => {
    console.log(x - scrollOffset, scrollOffset);
    setHoveredElement(<Info point={data[index]} x={x - scrollOffset} y={y} />);
  }
  const removeHover = () => setHoveredElement(undefined);

  useLayoutEffect(() => {
    const realWidth = view.current.unstable_getBoundingClientRect().width;
    const spacing = fitToWidth ? realWidth / data.length : 45;
    const width = fitToWidth ? realWidth : data.length * spacing;
    const realHeight = view.current.unstable_getBoundingClientRect().height;
    const height = realHeight - fontSize["100"] * 2; // Make space for horizontal labels
    const [elements, xLabels, yLabels] =
      constructGraph(
        data, fitToWidth,
        width, height, spacing,
        addHover, removeHover
      );
    setWidth(width);
    setHeight(height);
    setElements(elements);
    setVerticalLabels(yLabels);
    setHorizontalLabels(xLabels);
  }, [data, scrollOffset]);

  return (
    <View style={{ flexDirection: "row", height: "100%" }}>
      <View style={{ position: "relative", width: 35 }}>{verticalLabels}</View>
      <View style={{ width: 1, backgroundColor: "#000000", height }}></View>
      {hoveredElement}
      <ScrollView horizontal ref={view} onScroll={handleScroll}>
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
