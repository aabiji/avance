import { Link } from "expo-router";
import { FlatList, View } from "react-native";
import { useEffect, useState } from "react";

import { Container, SwipeableCard } from "@/components/containers";
import { ClickableIcon } from "@/components/buttons";
import { ThemedText } from "@/components/text";
import getColors from "@/components/theme";

import useStorage from "@/lib/storage";

// TODO: manage font sizes better (the same way we handle color shades)
// TODO: not happy with the design of the exercise cards. What's a better layout???

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

// TODO: output sound effects when toggling the session
// TODO: refactor the jsx
// TODO: how should we persist this temporary data??? (should we put it in local storage???)
// TODO: comment code
function HIITCard({ info, removeSelf }: { info: HIITExercise, removeSelf: () => void }) {
  const [icon, setIcon] = useState("play");
  const [seconds, setSeconds] = useState(info.workDuration);
  const [rounds, setRounds] = useState(info.rounds);
  const [working, setWorking] = useState(true);
  const [done, setDone] = useState(false);

  const edit = () => console.log("editing!");
  const toggleTimer = () => {
    setIcon(icon == "play" || done ? "pause" : "play");
    setDone(false);
  }

  const toggleSession = () => {
    if (working) {
      setSeconds(info.restDuration);
      setWorking(false);
    } else {
      setSeconds(info.workDuration);
      setWorking(true);
      setRounds(rounds - 1);

      const done = rounds - 1 == 0;
      if (done) {
        setIcon("reload");
        setDone(true);
        setRounds(info.rounds);
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
    <SwipeableCard maxXOffset={-50} style={{ marginBottom: 20, height: 125, borderRadius: 0 }}>

      <Container row style={{ width: "100%" }}>
        <Container style={{ height: "100%", alignItems: "flex-start", justifyContent: "space-between" }}>
          <ThemedText text={info.name} bold style={{ fontSize: 16 }} />

          <Container row>
            <ThemedText bold text={`${seconds} `} style={{ color: getColors().green }} />
            <ThemedText text={`s ${working ? "work" : "rest"}`} />
          </Container>

          <Container row style={{ width: "50%" }}>
            <ThemedText dimmed text={`${working ? info.restDuration : info.workDuration} s ${working ? "rest" : "work"}`} style={{ fontSize: 13 }} />
            <ThemedText dimmed text={`x${rounds}`} style={{ fontSize: 13, color: getColors().green }} />
          </Container>
        </Container>

        <ClickableIcon name={icon} transparent onPress={toggleTimer} />
      </Container>

      <CardOptions remove={removeSelf} edit={edit} />
    </SwipeableCard>
  );
}

function StrengthCard({ info, removeSelf }: { info: StrengthExercise, removeSelf: () => void }) {
  const [sets, setSets] = useState(0);

  const edit = () => console.log("editing!");

  const countSets = () => {
    const num = sets == info.sets ? 0 : sets + 1;
    setSets(Math.min(info.sets, num));
  }

  return (
    <SwipeableCard maxXOffset={-50} style={{ marginBottom: 20, height: 125, borderRadius: 0 }}>

      <Container row style={{ width: "100%" }}>
        <Container style={{ height: "100%", alignItems: "flex-start", justifyContent: "space-between" }}>
          <ThemedText text={info.name} bold style={{ fontSize: 16 }} />

          <Container row>
            <ThemedText bold text={`${sets} `} style={{ color: getColors().green }} />
            <ThemedText text={`/ ${info.sets} sets`} />
          </Container>

          <Container row style={{ width: "50%" }}>
            <ThemedText dimmed text={`${info.reps} reps`} style={{ fontSize: 13 }} />
            {info.weight > 0 && <ThemedText dimmed text={`${info.weight} lbs`} style={{ fontSize: 13 }} />}
          </Container>
        </Container>

        <ClickableIcon name={sets == info.sets ? "reload" : "add"} transparent onPress={countSets} />
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
