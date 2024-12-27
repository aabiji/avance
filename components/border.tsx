import { StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import getTheme from "@/components/theme";

export function GradientSeparator() {
  return (
    <LinearGradient
      colors={[getTheme().accent, getTheme().secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.rule}
    />
  );
}

// Gradient progress bar that wraps around an element
// The percentage controls how much we wrap around
// Basically we just assemble 4 linear gradients around in a box shape
export function GradientProgressBorder({
  percentage,
  width,
  height,
  thickness,
  childElement,
}) {
  const colors = [getTheme().accent, getTheme().secondary];
  const perimeter = width * 2 + height * 2;

  let sides = [height, width, height, width]; // left, bottom, right, top
  let amount = Math.round(percentage * perimeter);

  // Determine the length of each side
  for (let i = 0; i < sides.length; i++) {
    if (amount < sides[i]) {
      sides[i] = amount;
      sides.fill(0, i + 1, sides.length);
      break;
    }
    amount -= sides[i];
  }

  return (
    <View
      style={{
        flexDirection: "row",
        position: "relative",
        width: width,
        height: height,
        borderRadius: thickness * 2,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
      }}
    >
      {/*Inner element*/}
      <View
        style={{
          width: width - thickness,
          height: height - thickness,
          borderRadius: thickness * 2,
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        {childElement}
      </View>

      {/*Left*/}
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          width: thickness,
          height: sides[0],
          position: "absolute",
          left: 0,
          bottom: 0,
        }}
      />

      {/*Bottom*/}
      <LinearGradient
        colors={colors.reverse()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          width: sides[1],
          height: thickness,
          position: "absolute",
          bottom: 0,
          left: 0,
        }}
      />

      {/*Right*/}
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          width: thickness,
          height: sides[2],
          position: "absolute",
          right: 0,
          bottom: 0,
        }}
      />

      {/*Top*/}
      <LinearGradient
        colors={colors.reverse()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          width: sides[3],
          height: thickness,
          position: "absolute",
          top: 0,
          right: 0,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  rule: {
    height: 8,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
