import { ReactNode, useLayoutEffect, useRef, useState } from "react";
import { ScrollView, Text, View, GestureResponderEvent } from "react-native";
import { Circle, G, Line, Svg } from "react-native-svg";

import getColors, { fontSize } from "@/components/theme";

export interface DataPoint {
  value: number;
  label: string;
  info: string;
}

interface GraphData {
  width: number;
  height: number;
  svg: ReactNode[];
  yLabels: ReactNode[];
  xLabels: ReactNode[];
  points: Point[];
  simplifiedPoints: Point[];
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

type Point = { x: number; y: number; }

// Map a value from an input range (x1 to y1) to an output range (x2 to y2)
const map = (v: number, x1: number, y1: number, x2: number, y2: number) =>
  x2 + ((y2 - x2) / (y1 - x1)) * (v - x1);

// Find the lowest and the highest value in the data
function findExtremes(data: DataPoint[]): [number, number] {
  const lowest = Math.min(...data.map((point) => point.value));
  const highest = Math.max(...data.map((point) => point.value));
  // Extrapolate the low and high out so that
  // the graph has a bit of padding at both ends
  const fraction = Math.round((highest - lowest) * 0.1);
  const amount = Math.max(lowest * 0.01, fraction);
  return [lowest - amount, highest + amount];
}

// Function to calculate perpendicular distance of a point from a line segment
function perpendicularDistance(point: Point, start: Point, end: Point) {
  const x1 = start.x, y1 = start.y;
  const x2 = end.x, y2 = end.y;
  const x0 = point.x, y0 = point.y;
  const numerator = Math.abs((y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1);
  const denominator = Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
  return numerator / denominator;
}

// Ramer-Douglas-Peucker algorithm to simplify points
// Epsilon controls how much the points are reduced - a
// higher epsilon means more points are reduced
function douglasPeucker(points: Point[], epsilon: number): Point[] {
  if (points.length <= 2)
    return points; // Can't reduce further

  // Find the point with the maximum distance
  let maxDistance = 0;
  let index = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const distance =
      perpendicularDistance(points[i], points[0], points[points.length - 1]);
    if (distance > maxDistance) {
      maxDistance = distance;
      index = i;
    }
  }

  let result = [];
  if (maxDistance > epsilon) {
    // Recursively simplify the points before and after the farthest point
    const before = douglasPeucker(points.slice(0, index + 1), epsilon);
    const after = douglasPeucker(points.slice(index), epsilon);
    result = before.slice(0, before.length - 1).concat(after);
  } else {
    result = [points[0], points[points.length - 1]];
  }

  return result;
}

function constructGraph(
  data: DataPoint[], fitToWidth: boolean,
  width: number, height: number, spacing: number
): GraphData {
  const [lowest, highest] = findExtremes(data);
  const labelInterval = fitToWidth ? Math.min(4, data.length - 1) : 1;
  let labelCount = 0;
  let key = 0;

  let result: GraphData = {
    width, height, xLabels: [], yLabels: [],
    svg: [], points: [], simplifiedPoints: []
  };

  // Add the vertical labels
  for (let i = 0; i < 10; i++) {
    const y = map(i, 0, 10, 0, height);
    const value = map(i, 0, 10, highest, lowest);
    result.yLabels.push(
      <Text
        key={++key}
        style={{
          position: "absolute",
          top: y,
          fontSize: fontSize["100"],
          color: getColors().text["600"]
        }}>
        {value.toFixed(1)}
      </Text>
    );
  }

  // Add the horizontal axis
  result.svg.push(
    <Line
      key={++key} stroke={getColors().text["600"]} strokeWidth="3"
      x1={0} y1={height} x2={width} y2={height}
    />
  );

  for (let i = 0; i < data.length; i++) {
    // Add the xy point
    const x = i * spacing + spacing / 2;
    const y = map(data[i].value, lowest, highest, 0, height);
    result.points.push({ x: Math.round(x), y: Math.round(y) });

    // Add every nth horizontal label
    if (++labelCount == labelInterval) {
      result.xLabels.push(
        <View
          key={++key}
          style={{ width: spacing, position: "absolute", left: i * spacing }}>
          <Text
            style={{
              fontSize: fontSize["100"],
              textAlign: "center",
              color: getColors().text["600"]
            }}
          >
            {data[i].label}
          </Text>
        </View>
      );
      labelCount = 0;
    }
  }

  // TODO: Find a more optimal epsilon
  result.simplifiedPoints = douglasPeucker(result.points, result.points.length / 4)

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
    width: 0, height: 0, svg: [], points: [],
    xLabels: [], yLabels: [], simplifiedPoints: []
  });
  const [tooltip, setTooltip] = useState<ReactNode>();
  const [scrollX, setScrollX] = useState<number>(0);
  const currentPoints = () => fitToWidth ? graphData.simplifiedPoints : graphData.points;

  // Width between the start of the container and the vertical line
  const yLabelWidth = 35;

  // Show the tooltip containing info for the data point on hover
  const showTooltip = (event: GestureResponderEvent) => {
    const points = currentPoints();
    const x = event.nativeEvent.locationX;
    const y = event.nativeEvent.locationY;
    const clickRadius = 25;

    // Find the data point that was clicked
    let point = undefined;
    let [pointX, pointY] = [-1, -1];
    for (let i = 0; i < points.length; i++) {
      const [cx, cy] = [points[i].x, points[i].y];
      const inside = ((x - cx) ** 2) + ((y - cy) ** 2) < (clickRadius ** 2);
      if (inside) {
        point = data[i];
        pointY = cy;
        pointX = (yLabelWidth + cx) - scrollX;
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

  const handleScroll = (event) => setScrollX(event.nativeEvent.contentOffset.x);

  // TODO: improve the performance of the graph (especially when switching views)
  useLayoutEffect(() => {
    const rect = view.current.unstable_getBoundingClientRect();

    const spacing = fitToWidth ? rect.width / data.length : 45;
    const width =
      fitToWidth ? rect.width : Math.max(data.length * spacing, rect.width);

    // Make space for horizontal labels
    const height = rect.height - fontSize["100"] * 2;

    setGraphData(constructGraph(data, fitToWidth, width, height, spacing));
  }, [data, fitToWidth]);

  return (
    <View style={{ flexDirection: "row", height: "100%" }}>
      <View style={{ position: "relative", width: yLabelWidth }}>
        {graphData.yLabels}
      </View>
      <View
        style={{
          width: 1,
          backgroundColor: getColors().text["600"],
          height: graphData.height
        }}>
      </View>
      {tooltip}
      <ScrollView horizontal ref={view} onScroll={handleScroll}>
        <View style={{ flexDirection: "column", width: graphData.width }}>
          <Svg
            width={graphData.width} height={graphData.height}
            onPressIn={showTooltip}
            onPressOut={() => setTooltip(undefined)}>
            {
              currentPoints().map(({ x, y }, i) => (
                <G key={`${x}-${y}`}>
                  <Circle cx={x} cy={y} r="3"
                    fill={getColors().accent["200"]} />
                  {i < currentPoints().length - 1 &&
                    <Line
                      x1={x} y1={y} x2={currentPoints()[i + 1].x}
                      y2={currentPoints()[i + 1].y}
                      stroke={getColors().accent["300"]} />
                  }
                </G>
              ))
            }
            {graphData.svg}
          </Svg>
          <View style={{ flexDirection: "row" }}>{graphData.xLabels}</View>
        </View>
      </ScrollView>
    </View>
  );
}

export default Graph;