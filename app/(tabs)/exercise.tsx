import { View } from "react-native";
import { Link } from "expo-router";

import { Container, Row } from "@/components/containers";
import { ClickableIcon } from "@/components/buttons";
import { ThemedText } from "@/components/text";
import { GradientProgressBorder } from "@/components/border";

function ResistanceExercise() {
  return (
    <Row>
      <ClickableIcon transparent name="checkmark" onPress={() => console.log("done!")} />
      <ThemedText bold text="Lat pulldowns" />
      <View>
        <ThemedText dimmed text={"2 / 5 sets"} />
        <ThemedText dimmed text={"10 lbs"} />
      </View>
    </Row>
  );
}

function IntervalExercise() {
  return (
    <Row>
      <ClickableIcon transparent name="play" onPress={() => console.log("done!")} />
      <ThemedText bold text="Jump rope" />
      <View>
        <ThemedText dimmed text={"40s on"} />
        <ThemedText dimmed text={"20s off"} />
        <ThemedText dimmed text={"10 rounds"} />
      </View>
    </Row>
  );
}

export default function Exercises() {
  // TODO: can we not have the width and height be in pixels??
  return (
    <Container>
      <Row>
        <ThemedText header text="Exercises" />
        <Link href="/createExercise" asChild>
          <ClickableIcon name="add" />
        </Link>
      </Row>

      <GradientProgressBorder
        percentage={0.8}
        width={325}
        height={100}
        thickness={5}
        childElement={<IntervalExercise />}
      />

      <GradientProgressBorder
        percentage={0.2}
        width={325}
        height={100}
        thickness={5}
        childElement={<ResistanceExercise />}
      />
    </Container>
  );
}
