import { View, Text } from "react-native";
import { Link } from "expo-router";

import { Button } from "@/components/Elements";
import { colors, activeButton, stylesheet, transparentButton } from "@/app/components/design";
import LinearGradient from "react-native-linear-gradient";

// Gradient progress bar that wraps around an element
// The percentage controls how much we wrap around
// Basically we just assemble 4 linear gradients around in a box shape
function GradientProgressBorder({ percentage, width, height, thickness, colors, childElement }) {
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
            zIndex: 1
          }}>
            {childElement}
          </View>

        {/*Left*/}
        <LinearGradient
          colors={colors}
          start={{x:0, y:0}}
          end={{x:0, y:1}}
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
          start={{x:0, y:0}}
          end={{x:1, y:0}}
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
          start={{x:0, y:0}}
          end={{x:0, y:1}}
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
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={{
            width: sides[3],
            height: thickness,
            position: "absolute",
            top: 0,
            right: 0,
          }}
        />
      </View>
  )
}

function ResistanceExercise() {
  return (
    <View style={[ stylesheet.row ]}>
      <Button
        label="checkmark"
        color="black"
        hasIcon
        styling={ transparentButton }
        onPress={() => console.log("done!")}
      />
      <Text style={{ fontWeight: "bold" }}> Lat pulldowns </Text>
      <View>
        <Text style={{ color: colors.darkestgrey, marginLeft: 4 }}>
          <Text style={{ color: colors.blue }}>2</Text> /5 sets
        </Text>
        <Text style={{ color: colors.darkestgrey }}> 10 lbs </Text>
      </View>
    </View>
  )
}

function IntervalExercise() {
  return (
    <View style={[ stylesheet.row ]}>
      <Button
        label="play"
        color="black"
        hasIcon
        styling={ transparentButton }
        onPress={() => console.log("done!")}
      />
      <Text style={{ fontWeight: "bold" }}> Jump rope </Text>
      <View>
        <Text style={{ color: colors.darkestgrey }}> 40s on </Text>
        <Text style={{ color: colors.blue }}> 20s off </Text>
        <Text style={{ color: colors.darkestgrey, marginLeft: 4 }}>
          <Text style={{ color: colors.blue }}>3</Text> /15 rounds
        </Text>
      </View>
    </View>
  )
}

export default function Exercises() {
  // TODO: can we not have the width and height be in pixels??
  return (
    <View style={stylesheet.container}>
      <View style={[stylesheet.row, { width: "100%", marginBottom: 25 }]}>
        <Text style={[stylesheet.text, stylesheet.header]}>Exercises</Text>
        <Link href="/createExercise" asChild>
          <Button label="add" hasIcon styling={ activeButton } />
        </Link>
      </View>

      <GradientProgressBorder
        percentage={0.8}
        width={325}
        height={100}
        thickness={5}
        colors={[colors.aquamarine, colors.blue]}
        childElement={<IntervalExercise />}
      />

      <GradientProgressBorder
        percentage={0.2}
        width={325}
        height={100}
        thickness={5}
        colors={[colors.aquamarine, colors.blue]}
        childElement={<ResistanceExercise />}
      />
    </View>
  )
}