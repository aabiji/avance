import { Link, useNavigation } from "expo-router";
import { FlatList, View, StyleSheet } from "react-native";
import { useEffect, useState } from "react";

import { Container, SwipeableCard } from "@/components/containers";
import { ClickableIcon } from "@/components/buttons";
import { ThemedText } from "@/components/text";
import getColors from "@/components/theme";

import { Exercise, HIITExercise, StrengthExercise, ExerciseType } from "@/lib/types";

import request from "@/lib/http";
import useStorage from "@/lib/storage";

// TODO: manage font sizes better (the same way we handle color shades)
// TODO: not happy with the design of the exercise cards. What's a better layout???
// TODO: output sound effects when toggling the session
// TODO: how should we persist this temporary data??? (should we put it in local storage???)
// TODO: refactor the components

function CardOptions({ remove, edit }: { remove: () => void, edit: () => void }) {
  return (
    <View style={{ height: "100%" }}>
      <ClickableIcon
        name="pencil"
        style={{
          backgroundColor: getColors().green,
          borderRadius: 0, width: "110%", height: "50%"
        }}
        onPress={edit}
      />
      <ClickableIcon
        name="trash-bin"
        style={{
          backgroundColor: getColors().red,
          borderRadius: 0, width: "110%", height: "50%"
        }}
        onPress={remove}
      />
    </View>
  );
}

function HIITCard(
  { exercise, removeSelf }: {
    exercise: HIITExercise, removeSelf: () => void
  }) {
  const [icon, setIcon] = useState("play");
  const [seconds, setSeconds] = useState(exercise.workDuration);
  const [rounds, setRounds] = useState(exercise.rounds);

  const [working, setWorking] = useState(true);
  const [done, setDone] = useState(false);

  const edit = () => console.log("editing!");
  const toggleTimer = () => {
    setIcon(icon == "play" || done ? "pause" : "play");
    setDone(false);
  }

  const toggleSession = () => {
    if (working) {
      setSeconds(exercise.restDuration);
      setWorking(false);
    } else {
      setSeconds(exercise.workDuration);
      setWorking(true);
      setRounds(rounds - 1);

      const done = rounds - 1 == 0;
      if (done) {
        setIcon("reload");
        setDone(true);
        setRounds(exercise.rounds);
      }
    }
  };

  useEffect(() => {
    if (icon == "play" || done) return;
    const interval = setInterval(() => {
      setSeconds(seconds - 1);
      if (seconds == 0) toggleSession();
    }, 1000);
    return () => clearInterval(interval);
  }, [icon, seconds]);

  return (
    <SwipeableCard maxXOffset={-50} style={styles.card}>

      <Container row style={{ width: "100%" }}>
        <Container style={{ height: "100%", alignItems: "flex-start", justifyContent: "space-between" }}>
          <ThemedText text={exercise.name} bold style={{ fontSize: 16 }} />

          <Container row>
            <ThemedText bold text={`${seconds} `} style={{ color: getColors().secondary["100"] }} />
            <ThemedText text={`s ${working ? "work" : "rest"}`} />
          </Container>

          <Container row style={{ width: "50%" }}>
            <ThemedText dimmed text={`${working ? exercise.restDuration : exercise.workDuration} s ${working ? "rest" : "work"}`} style={{ fontSize: 13 }} />
            <ThemedText dimmed text={`x${rounds}`} style={{ fontSize: 13, color: getColors().secondary["100"] }} />
          </Container>
        </Container>

        <ClickableIcon dimmed name={icon} transparent onPress={toggleTimer} />
      </Container>

      <CardOptions remove={removeSelf} edit={edit} />
    </SwipeableCard>
  );
}

function StrengthCard(
  { exercise, removeSelf }: {
    exercise: StrengthExercise, removeSelf: () => void
  }) {
  const [sets, setSets] = useState(0);

  const navigation = useNavigation();
  const edit = () => navigation.navigate("createExercise", { name: exercise.name });

  const countSets = () => {
    const num = sets == exercise.sets ? 0 : sets + 1;
    setSets(Math.min(exercise.sets, num));
  }

  return (
    <SwipeableCard maxXOffset={-50} style={styles.card}>

      <Container row style={{ width: "100%" }}>
        <Container style={{ height: "100%", alignItems: "flex-start", justifyContent: "space-between" }}>
          <ThemedText text={exercise.name} bold style={{ fontSize: 16 }} />

          <Container row>
            <ThemedText bold text={`${sets} `} style={{ color: getColors().secondary["100"] }} />
            <ThemedText text={`/ ${exercise.sets} sets`} />
          </Container>

          <Container row style={{ width: "50%" }}>
            <ThemedText dimmed text={`${exercise.reps} reps`} style={{ fontSize: 13 }} />
            {exercise.weight > 0 && <ThemedText dimmed text={`${exercise.weight} lbs`} style={{ fontSize: 13 }} />}
          </Container>
        </Container>

        <ClickableIcon dimmed transparent name={sets == exercise.sets ? "reload" : "add"} onPress={countSets} />
      </Container>

      <CardOptions remove={removeSelf} edit={edit} />
    </SwipeableCard>
  );
}

export default function ExerciseScreen() {
  const [exercises, setExercises] = useStorage("exercises", []);
  const remove = (index: number) => {
    const name = exercises[index].name;
    const copy = [...exercises];
    copy.splice(index, 1);
    setExercises(copy);

    request({
      method: "DELETE",
      endpoint: "/delete_exercise",
      body: { name: name },
      // TODO: figure out what to do on error
      onError: (msg: unknown) => console.log("ERROR", msg),
      handler: () => console.log(`${name} deleted`),
    });
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
            ? <HIITCard exercise={item} removeSelf={() => remove(index)} />
            : <StrengthCard exercise={item} removeSelf={() => remove(index)} />;
        }
        }
        style={{ width: "100%" }}
        contentContainerStyle={{ marginHorizontal: -10, paddingHorizontal: 5 }}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 125,
    marginBottom: 20,
    borderRadius: 0
  }
});
