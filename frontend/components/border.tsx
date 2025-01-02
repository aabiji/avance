import { ReactNode, useState } from "react";
import { LayoutChangeEvent, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";

export function GradientSeparator(
  { colors, percentage }: { colors: string[], percentage: number }
) {
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{
        height: 5,
        borderRadius: 5,
        marginVertical: 10,
        alignSelf: "flex-start",
        width: `${percentage * 100}%`
      }}
    />
  );
}

interface ProgressBorderProps {
  children: ReactNode;
  percentage: number;
  thickness: number;
  colors: string[];
}

// A progress bar that wraps around an element with linear gradients.
// The percentage controls howmuchthe border is wrapped around the child elements.
export function ProgressBorder(
  { children, percentage, thickness, colors }: ProgressBorderProps
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
    <View style={{ position: "relative" }}>
      {sideLengths.map((length, i) => {
        const vertical = i % 2 == 0; // Left (index 0) and right (index 2) are vertical
        const end = vertical ? { x: 0, y: 1 } : { x: 1, y: 0 };
        const realLength = length > 0 ? length + thickness : 0;
        const positions = {
          left: i == 0 ? -thickness : undefined,
          bottom: i == 1 ? -thickness : undefined,
          right: i == 2 ? -thickness : undefined,
          top: i == 3 ? 0 : undefined,
        };
        return (
          <LinearGradient
            key={i}
            end={end}
            start={{ x: 0, y: 0 }}
            colors={vertical ? colors : colors.reverse()}
            style={{
              zIndex: 1,
              width: vertical ? thickness : realLength,
              height: vertical ? realLength : thickness,
              position: "absolute",
              ...positions
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
