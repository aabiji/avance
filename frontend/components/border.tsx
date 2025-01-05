import { ReactNode, useState } from "react";
import { LayoutChangeEvent, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";

interface ProgressBorderProps {
  children: ReactNode;
  percentage: number;
  colors: string[];
}

// A progress bar that wraps around an element with linear gradients.
// The percentage controls howmuchthe border is wrapped around the child elements.
export function ProgressBorder(
  { children, percentage, colors }: ProgressBorderProps
) {
  const [sideLengths, setSideLengths] = useState<number[]>([]);

  // Compute the side lengths of the border based
  // on the percentage used to wrap around
  const onLeyout = (event: LayoutChangeEvent) => {
    let { width, height } = event.nativeEvent.layout;
    [width, height] = [Math.round(width), Math.round(height)];
    let sides = [height, width, height, width]; // left, bottom, right, top

    const perimeter = width * 2 + height * 2;
    let length = Math.round(perimeter * percentage);

    for (let i = 0; i < sides.length; i++) {
      if (length < sides[i]) {
        sides[i] = length;
        sides.fill(0, i + 1, sides.length);
        break;
      }
      length -= sides[i];
    }

    setSideLengths(sides);
  };

  return (
    <View style={{ position: "relative", marginBottom: 15 }}>
      {sideLengths.map((length, i) => {
        const thickness = 2;
        const vertical = i % 2 == 0; // Left (index 0) and right (index 2) are vertical
        const end = vertical ? { x: 0, y: 1 } : { x: 1, y: 0 };
        const positions = [
          { left: thickness * 5 }, // Left
          { left: thickness * 5, bottom: 0 }, // Bottom
          { right: thickness * 5, bottom: 0 }, // Right
          { right: thickness * 5, top: 0 } // Top
        ];
        const width = length - thickness * 10;

        return (
          <LinearGradient
            key={i}
            end={end}
            start={{ x: 0, y: 0 }}
            colors={vertical ? colors : [...colors].reverse()}
            style={{
              zIndex: 1,
              width: vertical ? thickness : width,
              height: vertical ? length : thickness,
              position: "absolute",
              ...positions[i]
            }}
          />
        )
      })}

      <View onLayout={onLeyout}>
        {children}
      </View>
    </ View >
  );
}
