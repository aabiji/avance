import { ReactNode, useLayoutEffect, useRef, useState } from "react";
import { ScrollView, Text, View, GestureResponderEvent } from "react-native";
import { Circle, Line, Svg } from "react-native-svg";

import getColors, { fontSize } from "@/components/theme";

export interface GraphPoint {
  value: number;
  label: string;
  info: string;
}

export interface TooltipProps {
  point: GraphPoint;
  x: number;
  y: number;
}

export interface GraphProps {
  data: GraphPoint[];
  fitToWidth: boolean;
}

// Map a value from an input range (x1 to y1) to an output range (x2 to y2)
const map = (v: number, x1: number, y1: number, x2: number, y2: number) =>
  x2 + ((y2 - x2) / (y1 - x1)) * (v - x1);

// Find the lowest and the highest value in the data
function findExtremes(data: GraphPoint[]): [number, number] {
  const lowest = Math.min(...data.map((point) => point.value));
  const highest = Math.max(...data.map((point) => point.value));
  // Extrapolate the low and high out so that
  // the graph has a bit of padding at both ends
  const amount = Math.round((highest - lowest) * 0.1);
  return [lowest - amount, highest + amount];
}

function constructGraph(
  data: GraphPoint[], fitToWidth: boolean,
  width: number, height: number, spacing: number
) {
  const labelInterval = fitToWidth ? 4 : 1;
  let labelCount = 0;

  let elements = [];
  let xLabels = [];
  let yLabels = [];

  const [lowest, highest] = findExtremes(data);

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
    // Add the point (index is a custom prop)
    const x = i * spacing + spacing / 2;
    const y = map(data[i].value, lowest, highest, 0, height);
    elements.push(
      <Circle
        key={++key}
        index={i} cx={x} cy={y} r="3"
        fill={getColors().accent["500"]} />
    );

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

function Tooltip({ point, x, y }: TooltipProps) {
  return (
    <View
      style={{
        width: "100%", height: "100%", position: "absolute",
        backgroundColor: "transparent", top: 0
      }}>
      <View
        style={{
          transform: "translate(-50%, 0)",
          position: "absolute", zIndex: 1,
          left: x, top: 0, padding: 8, borderRadius: 10,
          backgroundColor: getColors().secondary["500"]
        }}>
        <Text
          style={{
            fontSize: fontSize["200"],
            color: getColors().text["50"],
          }}>
          {point.info}
        </Text>
      </View>

      <View
        style={{
          width: 1, height: y,
          position: "absolute", left: x,
          backgroundColor: getColors().text["200"]
        }}>
      </View>
    </View>
  );
}

export function Graph({ data, fitToWidth }: GraphProps) {
  const view = useRef(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [elements, setElements] = useState<ReactNode[]>([]);
  const [verticalLabels, setVerticalLabels] = useState<ReactNode[]>([]);
  const [horizontalLabels, setHorizontalLabels] = useState<ReactNode[]>([]);
  const [tooltip, setTooltip] = useState<ReactNode>();

  // Show the tooltip containing info for the data point on hover
  const showTooltip = (event: GestureResponderEvent) => {
    const x = event.nativeEvent.locationX;
    const y = event.nativeEvent.locationY;
    const clickRadius = 25;

    // Find the data point that was clicked
    let point = undefined;
    let [pointX, pointY] = [-1, -1];
    for (const element of elements) {
      if (element.type !== Circle) continue;
      const [cx, cy] = [element.props.cx, element.props.cy];
      const inside = ((x - cx) ** 2) + ((y - cy) ** 2) < (clickRadius ** 2);
      if (inside) {
        point = data[element.props.index];
        pointX = cx;
        pointY = cy;
      }
    }

    // Show the hover element if we clicked a data point
    if (point !== undefined) {
      setTooltip(<Tooltip point={point} x={pointX} y={pointY} />);
    } else {
      setTooltip(undefined);
    }
  }

  useLayoutEffect(() => {
    const realWidth = view.current.unstable_getBoundingClientRect().width;
    const spacing = fitToWidth ? realWidth / data.length : 45;
    const width = fitToWidth ? realWidth : data.length * spacing;

    const realHeight = view.current.unstable_getBoundingClientRect().height;
    // make space for horizontal labels
    const height = realHeight - fontSize["100"] * 2;

    const [elements, xLabels, yLabels] =
      constructGraph(data, fitToWidth, width, height, spacing);

    setWidth(width);
    setHeight(height);
    setElements(elements);
    setVerticalLabels(yLabels);
    setHorizontalLabels(xLabels);
  }, [data, fitToWidth]);

  return (
    <View style={{ flexDirection: "row", height: "100%" }}>
      <View style={{ position: "relative", width: 35 }}>{verticalLabels}</View>
      <View style={{ width: 1, backgroundColor: "#000000", height }}></View>

      <ScrollView horizontal ref={view}>
        <View style={{ flexDirection: "column", width: width }}>
          <Svg
            width={width} height={height}
            onPressIn={showTooltip}
            onPressOut={() => setTooltip(undefined)}>
            {elements}
          </Svg>

          <View style={{ flexDirection: "row" }}>
            {horizontalLabels}
          </View>

          {tooltip}
        </View>
      </ScrollView>
    </View>
  );
}

export default Graph;
