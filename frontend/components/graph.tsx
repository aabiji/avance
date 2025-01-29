import { ReactNode, useLayoutEffect, useRef, useState } from "react";
import { ScrollView } from "react-native";
import { Circle, Line, Svg } from "react-native-svg";

export interface GraphPoint {
  value: number;
  label: string;
}

interface GraphProps {
  data: GraphPoint[];
  showEverything: boolean;
}

export function Graph({ data, showEverything }: GraphProps) {
  const [containerHeight, setContainerHeight] = useState(0);
  const container = useRef(null);

  const [circles, setCircles] = useState<ReactNode[]>([]);
  const [lines, setLines] = useState<ReactNode[]>([]);

  const lowest = Math.min(...data.map((point) => point.value));
  const highest = Math.max(...data.map((point) => point.value));
  const spacing = 25;

  const getXY = (index: number, height: number) => {
    const v = data[index].value;
    // Map from the range of lowest to highest to 0 to height
    const y = (height / (highest - lowest)) * (v - lowest);
    return [index * spacing, y];
  };

  useLayoutEffect(() => {
    const height = container.current.unstable_getBoundingClientRect().height;
    let circles = [];
    let lines = [];

    for (let i = 0; i < data.length; i++) {
      // Draw the current point
      const [x, y] = getXY(i, height);
      circles.push(<Circle key={i} cx={x} cy={y} r="3" fill="blue" />);

      // Draw connecting line to the next point
      if (i + 1 < data.length) {
        const [nextX, nextY] = getXY(i + 1, height);
        lines.push(<Line key={i} x1={x} y1={y} x2={nextX} y2={nextY} stroke="blue" />);
      }
    }

    setCircles(circles);
    setLines(lines);
    setContainerHeight(height);
  }, [data]);

  return (
    <ScrollView horizontal ref={container}>
      <Svg width={data.length * spacing} height={containerHeight}>{circles}{lines}</Svg>
    </ScrollView>
  );
}

export default Graph;