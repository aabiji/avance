import { Link } from "expo-router";
import { FlatList, Pressable, View } from "react-native";
import { useState } from "react";

import { Container, SwipeableCard } from "@/components/containers";
import { ClickableIcon } from "@/components/buttons";
import { ThemedText } from "@/components/text";
import { ProgressBorder } from "@/components/border";
import getColors from "@/components/theme";

import useStorage from "@/lib/storage";

// TODO: actually --- what if we just didn't have a progress border and redesigned the exercise cards
//       instead of having buttons and stuff we can just highlight the current set or things like that
// TODO: for strength exercises, we should update the number of sets when clicking on the card
//       center the text

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

function CardOptions({ remove, edit }: { remove: () => void, edit: () => void }) {
  return (
    <View style={{ height: "100%" }}>
      <ClickableIcon
        name="reload"
        style={{
          backgroundColor: getColors().primary["100"],
          borderRadius: 0, width: "110%", height: "33%"
        }}
        onPress={edit}
      />
      <ClickableIcon
        name="pencil"
        style={{
          backgroundColor: getColors().green,
          borderRadius: 0, width: "110%", height: "33%"
        }}
        onPress={edit}
      />
      <ClickableIcon
        name="trash-bin"
        style={{
          backgroundColor: getColors().red,
          borderRadius: 0, width: "110%", height: "34%"
        }}
        onPress={remove}
      />
    </View>
  );
}

function HIITCard({ info, removeSelf }: { info: Exercise, removeSelf: () => void }) {
  const colors = [getColors().green, getColors().red];
  const [icon, setIcon] = useState("play");

  const edit = () => console.log("editing!");

  const toggleTimer = () => {
    const paused = icon == "play";
    setIcon(paused ? "pause" : "play");
  };

  // NOTE: setting the key prop forces the component to rerender when reps changes

  return (
    <ProgressBorder percentage={0.0} colors={colors}>
      <SwipeableCard maxXOffset={-50} style={{ height: 100, borderRadius: 0 }}>
        <Container row style={{ width: "100%", height: "100%", paddingHorizontal: 20 }}>
          <ClickableIcon
            transparent
            dimmed
            name={icon}
            style={{ marginLeft: -10 }}
            onPress={toggleTimer}
          />

          <ThemedText bold text={info.name} />

          <View>
            <ThemedText dimmed text={`${info.workDuration}s work`} />
            <ThemedText dimmed text={`${info.restDuration}s rest`} />
            <ThemedText dimmed text={`${info.rounds} rounds`} />
          </View>
        </Container>

        <CardOptions remove={removeSelf} edit={edit} />
      </SwipeableCard>
    </ProgressBorder>
  );
}

function StrengthCard({ info, removeSelf }: { info: Exercise, removeSelf: () => void }) {
  const [sets, setSets] = useState(0);

  const edit = () => console.log("editing!");

  const countReps = () => {
    if (sets < info.sets) {
      setSets(sets + 1);
    }
  }

  return (
    <SwipeableCard maxXOffset={-50} style={{ height: 100, marginBottom: 20, height: 150 }}>


      <Container row style={{ width: "100%", height: "100%", paddingHorizontal: 20 }}>

        <Container row style={{ width: "60%", backgroundColor: "red" }}>
          <ThemedText bold text={info.name} />
        </Container>

        <Container style={{ width: "40" }}>
          <Container row>
            <ThemedText style={{ color: getColors().green, fontSize: 16 }} text={`${sets}`} />
            <ThemedText text={` / ${info.sets} sets`} />
          </Container>

          <ThemedText dimmed text={`${info.reps} reps`} />
          <ThemedText dimmed text={`${info.weight} lbs`} />
        </Container>

      </Container>


      <CardOptions remove={removeSelf} edit={edit} />
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
        renderItem={({ item, index }) => {
          const isHiit = (item as HIITExercise).rounds !== undefined;
          return isHiit
            ? <HIITCard info={item} removeSelf={() => removeExercise(index)} />
            : <StrengthCard info={item} removeSelf={() => removeExercise(index)} />;
        }
        }
        style={{ width: "100%" }}
        contentContainerStyle={{ marginHorizontal: -10, paddingHorizontal: 5 }}
      />
    </Container>
  );
}
