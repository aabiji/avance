import { FlatList, View } from "react-native";
import { Link } from "expo-router";

import { Container, SwipeableCard } from "@/components/containers";
import { ClickableIcon } from "@/components/buttons";
import { ThemedText } from "@/components/text";
import getColors from "@/components/theme";

import useStorage from "@/lib/storage";

export interface HIITExercise {
  name: string;
  workDuration: number,
  restDuration: number,
  rounds: number,
}

export interface StrengthExercise {
  name: string;
  reps: number;
  sets: number;
  weight: number;
}

export type Exercise = HIITExercise | StrengthExercise;

function ExerciseCard({ info, removeSelf }: { info: Exercise, removeSelf: () => void }) {
  const hiit = (info as HIITExercise).rounds !== undefined;

  return (
    <SwipeableCard maxXOffset={-50} style={{ height: 100 }}>
      <Container row style={{ width: "100%", height: "100%", paddingHorizontal: 20 }}>
        {
          hiit
            ? <ClickableIcon
              transparent
              dimmed
              name="play"
              style={{ marginLeft: -20 }}
              onPress={() => console.log("done!")}
            />
            : <ClickableIcon
              transparent
              dimmed
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
            backgroundColor: getColors().green,
            borderRadius: 0, width: "110%", height: "50%"
          }}
          onPress={() => console.log("editing!")}
        />
        <ClickableIcon
          name="trash-bin"
          style={{
            backgroundColor: getColors().red,
            borderRadius: 0, width: "110%", height: "50%"
          }}
          onPress={removeSelf}
        />
      </View>
    </SwipeableCard>
  );
}

export default function ExerciseScreen() {
  const [exercises, setExercises] = useStorage("exercises", []);
  const removeExercise = (index: number) => {
    const copy = [...exercises];
    copy.splice(index, 1);
    setExercises(copy);
  };

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
        renderItem={({ item, index }) =>
          <ExerciseCard info={item} removeSelf={() => removeExercise(index)} />
        }
        style={{ width: "100%" }}
        contentContainerStyle={{ marginHorizontal: -10, paddingHorizontal: 5 }}
      />
    </Container>
  );
}
