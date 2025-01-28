import { useNavigation } from "expo-router";
import { useAudioPlayer } from "expo-audio";
import { FlatList, View, StyleSheet } from "react-native";
import { useEffect, useState } from "react";

import { Container, SwipeableCard } from "@/components/containers";
import { ClickableIcon } from "@/components/buttons";
import Selection from "@/components/selection";
import { ThemedText } from "@/components/text";
import getColors from "@/components/theme";

import { HIITExercise, StrengthExercise } from "@/lib/types";

import request from "@/lib/http";
import useStorage from "@/lib/storage";

function CardOptions({ exercise, remove }: { exercise: string, remove: () => void }) {
  const navigation = useNavigation();

  return (
    <View style={{ height: "100%" }}>
      <ClickableIcon
        name="pencil"
        style={{
          backgroundColor: getColors().green,
          borderRadius: 0, width: "110%", height: "50%"
        }}
        onPress={() => navigation.navigate("createExercise", { previousExercise: exercise })}
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
  const player = useAudioPlayer(require("@/assets/beep.mp3"));

  // Can either be "play", "pause" or "reload". Using the icon
  // name to determine whether we're playing the timer, pausing
  // the timer or reloading the timer.
  const [icon, setIcon] = useState("play");

  const [seconds, setSeconds] = useState(exercise.workDuration);
  const [rounds, setRounds] = useState(exercise.rounds);

  const [working, setWorking] = useState(true); // Whether we're in a work session
  const [done, setDone] = useState(false); // Whether we've completed all rounds

  const toggleIcon = () => {
    setIcon(icon == "play" || done ? "pause" : "play");
    setDone(false);
  };

  // Transistion between work and rest session
  const toggleSession = async () => {
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
    player.play(); // TODO: we don't seem to be playing multiple times
  };

  // Count down the duration of the current session
  useEffect(() => {
    if (icon == "play" || done) return;

    const interval = setInterval(() => {
      setSeconds(seconds - 1);
      if (seconds == 0) toggleSession();
    }, 1000);

    return () => clearInterval(interval);
  }, [icon, seconds]);

  const upcomingSession = () => {
    const secs = working ? exercise.restDuration : exercise.workDuration;
    return `${secs}s ${working ? "rest" : "work"}`;
  }

  return (
    <SwipeableCard maxXOffset={-50} style={styles.card}>
      <Container row style={{ width: "100%" }}>
        <Container style={styles.infoColumn}>
          <ThemedText text={exercise.name} bold style={{ fontSize: 16 }} />

          {/* Emphasize the current session */}
          <Container row>
            <ThemedText
              bold
              text={`${seconds} `}
              style={{ color: getColors().secondary["100"] }}
            />
            <ThemedText text={`s ${working ? "work" : "rest"}`} />
          </Container>

          <Container row style={{ width: "50%" }}>
            <ThemedText
              dimmed
              text={upcomingSession()}
              style={{ fontSize: 13 }}
            />
            <ThemedText
              dimmed
              text={`x${rounds}`}
              style={{ fontSize: 13, color: getColors().secondary["100"] }}
            />
          </Container>
        </Container>

        <ClickableIcon dimmed name={icon} transparent onPress={toggleIcon} />
      </Container>

      <CardOptions remove={removeSelf} exercise={JSON.stringify(exercise)} />
    </SwipeableCard>
  );
}

function StrengthCard(
  { exercise, removeSelf }: {
    exercise: StrengthExercise, removeSelf: () => void,
  }) {
  const [sets, setSets] = useState(0);
  const countSets = () => setSets((sets + 1) % (exercise.sets + 1));

  return (
    <SwipeableCard maxXOffset={-50} style={styles.card}>
      <Container row style={{ width: "100%" }}>
        <Container style={styles.infoColumn}>
          <ThemedText text={exercise.name} bold style={{ fontSize: 16 }} />

          <Container row>
            <ThemedText
              bold
              text={`${sets} `}
              style={{ color: getColors().secondary["100"] }}
            />
            <ThemedText text={`/ ${exercise.sets} sets`} />
          </Container>

          <Container row style={{ width: "50%" }}>
            <ThemedText
              dimmed
              text={`${exercise.reps} reps`}
              style={{ fontSize: 13 }}
            />
            {exercise.weight > 0 &&
              <ThemedText
                dimmed
                text={`${exercise.weight} lbs`}
                style={{ fontSize: 13 }}
              />
            }
          </Container>
        </Container>

        <ClickableIcon
          dimmed transparent
          name={sets == exercise.sets ? "reload" : "add"}
          onPress={countSets}
        />
      </Container>

      <CardOptions remove={removeSelf} exercise={JSON.stringify(exercise)} />
    </SwipeableCard>
  );
}

export default function ExerciseScreen() {
  const navigation = useNavigation();

  const [token, _setToken] = useStorage("token", undefined);
  const [exercises, setExercises] = useStorage("exercises", []);
  const [currentExercises, setCurrentExercises] = useState([]);
  const [currentDay, setCurrentDay] = useStorage("weekDay", new Date().getDay());
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  useEffect(() => {
    setCurrentDay(new Date().getDay());
    setCurrentExercises(exercises.filter((e) => e.weekDay == currentDay));
  }, []);

  useEffect(() => {
    setCurrentExercises(exercises.filter((e) => e.weekDay == currentDay));
  }, [currentDay]);

  const remove = (index: number) => {
    const name = exercises[index].name;
    const isHiit = exercises[index].rounds !== undefined;
    const copy = [...exercises];
    copy.splice(index, 1);
    setExercises(copy);

    request({
      method: "DELETE",
      endpoint: "/deleteExercise",
      body: { name, isHiit }, token,
      // TODO: figure out what to do on error
      onError: (msg: unknown) => console.log("ERROR", msg),
      handler: () => console.log(`${name} deleted`),
    });
  };

  return (
    <Container>
      <Container row style={{ width: "100%", marginBottom: 10 }}>
        <ThemedText header text={`${days[currentDay]}'s exercises`} style={{ fontSize: 20 }} />
        <ClickableIcon name="add" onPress={() => navigation.navigate("createExercise", {})} />
      </Container>

      <Selection options={days.map((day) => day[0])} selection={currentDay} setSelection={setCurrentDay} />

      {
        currentExercises.length > 0
          ? <FlatList
            data={currentExercises}
            renderItem={({ item, index }) => {
              const isHiit = (item as HIITExercise).rounds !== undefined;
              // TODO: 2 items with same key error when we create a new exercise
              return isHiit
                ? <HIITCard key={index} exercise={item} removeSelf={() => remove(index)} />
                : <StrengthCard key={index} exercise={item} removeSelf={() => remove(index)} />;
            }
            }
            style={{ width: "100%" }}
            contentContainerStyle={{ marginHorizontal: -10, paddingHorizontal: 5 }}
          />
          : <ThemedText text="No exercises" />
      }

    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 125,
    marginBottom: 20
  },
  infoColumn: {
    height: "100%",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexDirection: "column"
  }
});
