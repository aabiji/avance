import { ReactNode, useLayoutEffect, useRef, useState } from "react";
import { ScrollView, Text, View, GestureResponderEvent } from "react-native";
import { Circle, G, Line, Svg } from "react-native-svg";

import getColors, { fontSize } from "@/components/theme";

export interface DataPoint {
  value: number;
  label: string;
  info: string;
}

type Point = { x: number; y: number; }

interface GraphData {
  width: number;
  height: number;
  svg: ReactNode[];
  yLabels: ReactNode[];
  xLabels: ReactNode[];
  points: Point[];
}

interface TooltipProps {
  point: DataPoint;
  containerHeight: number;
  x: number;
  y: number;
}

interface GraphProps {
  data: DataPoint[];
  fitToWidth: boolean;
}

// Map a value from an input range (x1 to y1) to an output range (x2 to y2)
const map = (v: number, x1: number, y1: number, x2: number, y2: number) =>
  x2 + ((y2 - x2) / (y1 - x1)) * (v - x1);

// Find the lowest and the highest value in the data
function findExtremes(data: DataPoint[]): [number, number] {
  const lowest = Math.min(...data.map((point) => point.value));
  const highest = Math.max(...data.map((point) => point.value));
  // Extrapolate the low and high out so that
  // the graph has a bit of padding at both ends
  const amount = Math.round((highest - lowest) * 0.1);
  return [lowest - amount, highest + amount];
}

function constructGraph(
  data: DataPoint[], fitToWidth: boolean,
  width: number, height: number, spacing: number
) {
  const [lowest, highest] = findExtremes(data);
  const labelInterval = fitToWidth ? 4 : 1;
  let labelCount = 0;
  let key = 0;

  let result: GraphData = {
    xLabels: [], yLabels: [], width,
    svg: [], points: [], height
  };

  // Add the vertical labels
  for (let i = 0; i < 10; i++) {
    const y = map(i, 0, 10, 0, height);
    const value = map(i, 0, 10, highest, lowest);
    result.yLabels.push(
      <Text
        key={++key}
        style={{ position: "absolute", top: y, fontSize: fontSize["100"] }}>
        {value.toFixed(1)}
      </Text>
    );
  }

  // Add the horizontal axis
  result.svg.push(
    <Line
      key={++key} stroke="#000000" strokeWidth="3"
      x1={0} y1={height} x2={width} y2={height}
    />
  );

  for (let i = 0; i < data.length; i++) {
    const x = i * spacing + spacing / 2;
    const y = map(data[i].value, lowest, highest, 0, height);
    result.points.push({ x, y });

    // Add every nth horizontal label
    if (++labelCount == labelInterval) {
      result.xLabels.push(
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
  }

  return result;
}

function Tooltip({ point, x, y, containerHeight }: TooltipProps) {
  // Draw the tooltip above or below the data point.
  // If the data point is near the top,
  // the tooltip should be near the bottom and vice versea.
  const height = 30;
  return (
    <View
      style={{
        width: "100%", height: "100%", position: "absolute",
        backgroundColor: "transparent", top: 0
      }}>
      <View
        style={{
          transform: "translate(-50%, 0)",
          position: "absolute", zIndex: 1, height,
          top: y <= height ? undefined : 0,
          bottom: y <= height ? height / 2 : undefined,
          left: x, padding: 6, borderRadius: 10,
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
          width: 1, position: "absolute",
          height: y <= height ? containerHeight - y : y,
          top: y <= height ? y : 0, left: x,
          backgroundColor: getColors().text["200"]
        }}>
      </View>
    </View>
  );
}

export function Graph({ data, fitToWidth }: GraphProps) {
  const view = useRef(null);
  const [graphData, setGraphData] = useState<GraphData>({
    width: 0, height: 0, svg: [], xLabels: [], yLabels: [], points: []
  });
  const [tooltip, setTooltip] = useState<ReactNode>();

  // Show the tooltip containing info for the data point on hover
  const showTooltip = (event: GestureResponderEvent) => {
    const x = event.nativeEvent.locationX;
    const y = event.nativeEvent.locationY;
    const clickRadius = 25;

    // Find the data point that was clicked
    let point = undefined;
    let [pointX, pointY] = [-1, -1];
    for (let i = 0; i < graphData.points.length; i++) {
      const [cx, cy] = [graphData.points[i].x, graphData.points[i].y];
      const inside = ((x - cx) ** 2) + ((y - cy) ** 2) < (clickRadius ** 2);
      if (inside) {
        point = data[i];
        pointX = cx;
        pointY = cy;
      }
    }

    // Show the hover element if we clicked a data point
    if (point !== undefined) {
      setTooltip(
        <Tooltip
          point={point} x={pointX}
          y={pointY} containerHeight={graphData.height} />
      );
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

    setGraphData(constructGraph(data, fitToWidth, width, height, spacing));
  }, [data, fitToWidth]);

  return (
    <View style={{ flexDirection: "row", height: "100%" }}>
      <View style={{ position: "relative", width: 35 }}>{graphData.yLabels}</View>
      <View style={{ width: 1, backgroundColor: "#000000", height: graphData.height }}></View>

      <ScrollView horizontal ref={view}>
        <View style={{ flexDirection: "column", width: graphData.width }}>
          <Svg
            width={graphData.width} height={graphData.height}
            onPressIn={showTooltip}
            onPressOut={() => setTooltip(undefined)}>
            {
              graphData.points.map(({ x, y }, i) => (
                <G key={`${x}-${y}`}>
                  <Circle cx={x} cy={y} r="3"
                    fill={getColors().accent["500"]} />
                  {i < graphData.points.length - 1 &&
                    <Line
                      x1={x} y1={y} x2={graphData.points[i + 1].x}
                      y2={graphData.points[i + 1].y}
                      stroke={getColors().accent["600"]} />
                  }
                </G>
              ))
            }
            {graphData.svg}
          </Svg>

          <View style={{ flexDirection: "row" }}>{graphData.xLabels}</View>

          {tooltip}
        </View>
      </ScrollView>
    </View>
  );
}

export default Graph;
