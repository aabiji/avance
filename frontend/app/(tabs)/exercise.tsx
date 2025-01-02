import { FlatList, View } from "react-native";
import { Link } from "expo-router";

import { Container, SwipeableCard } from "@/components/containers";
import { ClickableIcon } from "@/components/buttons";
import { ThemedText } from "@/components/text";
import { ProgressBorder } from "@/components/border";
import getTheme from "@/components/theme";

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
  const colors = [getTheme().secondary, getTheme().primary];

  return (
    <ProgressBorder percentage={1.0} thickness={3} colors={colors}>
      <SwipeableCard maxXOffset={-50} style={{ height: 100 }}>
        <Container row style={{ width: "100%", height: "100%" }}>
          {
            hiit
              ? <ClickableIcon
                transparent
                name="play"
                onPress={() => console.log("done!")}
              />
              : <ClickableIcon
                transparent
                name="checkmark"
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
          <ClickableIcon name="pencil" onPress={() => console.log("editing!")} />
          <ClickableIcon name="trash-bin" onPress={() => console.log("deleting!")} />
        </View>
      </SwipeableCard>
    </ProgressBorder >
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
      <Container row style={{ width: "100%" }}>
        <ThemedText header text="Exercises" />
        <Link href="/createExercise" asChild>
          <ClickableIcon name="add" />
        </Link>
      </Container>

      <FlatList
        data={exercises}
        renderItem={({ item }) =>
          <Exercise info={item} />
        }
        contentContainerStyle={{ width: "100%", marginHorizontal: -10 }}
      />
    </Container>
  );
}
