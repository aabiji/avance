import { FlatList, View } from "react-native";
import { Link } from "expo-router";

import { Container, SwipeableCard } from "@/components/containers";
import { ClickableIcon } from "@/components/buttons";
import { ThemedText } from "@/components/text";
import getColors from "@/components/theme";

interface HIITExercise {
  name: string;
  workDuration: number,
  restDuration: number,
  rounds: number,
}

interface StrengthExercise {
  name: string;
  reps: number;
  sets: number;
  weight: number;
}

type Exercise = HIITExercise | StrengthExercise;

function Exercise({ info }: { info: Exercise }) {
  const hiit = (info as HIITExercise).rounds !== undefined;

  return (
    <SwipeableCard maxXOffset={-50} style={{ height: 100 }}>
      <Container row style={{ width: "100%", height: "100%", paddingHorizontal: 20 }}>
        {
          hiit
            ? <ClickableIcon
              transparent
              name="play"
              style={{ marginLeft: -20 }}
              onPress={() => console.log("done!")}
            />
            : <ClickableIcon
              transparent
              name="checkmark"
              style={{ marginLeft: -20 }}
              onPress={() => console.log("done!")}
            />
        }

        <ThemedText bold text={info.name} />

        <View>
          <ThemedText dimmed text={"5 sets"} />
          <ThemedText dimmed text={"5 reps"} />
          <ThemedText dimmed text={"10 lbs"} />
        </View>
      </Container>

      <View style={{ height: "100%" }}>
        <ClickableIcon
          name="pencil"
          style={{
            backgroundColor: getColors().green["default"],
            borderRadius: 0, width: "110%", height: "50%"
          }}
          onPress={() => console.log("editing!")}
        />
        <ClickableIcon
          name="trash-bin"
          style={{
            backgroundColor: getColors().red["default"],
            borderRadius: 0, width: "110%", height: "50%"
          }}
          onPress={() => console.log("deleting!")}
        />
      </View>
    </SwipeableCard>
  );
}

export default function Exercises() {
  const exercises: Exercise[] = [
    { name: "Push ups", sets: 3, reps: 20, weight: 10 },
    { name: "Jump rope", workDuration: 40, restDuration: 20, rounds: 15 },
    { name: "Pull ups", sets: 2, reps: 15, weight: 0 },
    { name: "Squats", sets: 5, reps: 50, weight: 20 },
  ];

  return (
    <Container>
      <Container row style={{ width: "100%", marginBottom: 10 }}>
        <ThemedText header text="Exercises" />
        <Link href="/createExercise" asChild>
          <ClickableIcon name="add" />
        </Link>
      </Container>

      <FlatList
        data={exercises}
        renderItem={({ item }) => <Exercise info={item} />}
        style={{ width: "100%" }}
        contentContainerStyle={{ marginHorizontal: -10, paddingHorizontal: 5 }}
      />
    </Container>
  );
}
