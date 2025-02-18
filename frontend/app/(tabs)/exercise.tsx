import { useNavigation } from "expo-router";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { FlatList, View, StyleSheet } from "react-native";
import { useEffect, useState } from "react";

import { Container, SwipeableCard } from "@/components/containers";
import { ClickableIcon } from "@/components/buttons";
import Selection from "@/components/selection";
import { ThemedText } from "@/components/text";
import getColors, { fontSize } from "@/components/theme";

import { HIITExercise, StrengthExercise } from "@/lib/types";
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
  const sound = useAudioPlayer(require("@/assets/countdown.mp3"));
  const status = useAudioPlayerStatus(sound);
  const [wasPlaying, setWasPlaying] = useState(false);

  // Make the sound effect replayable
  useEffect(() => {
    if (status.didJustFinish) {
      sound.seekTo(0);
      sound.pause();
    }
  }, [status]);

  // Can either be "play", "pause" or "reload". Using the icon
  // name to determine whether we're playing the timer, pausing
  // the timer or reloading the timer.
  const [icon, setIcon] = useState("play");

  const [seconds, setSeconds] = useState(exercise.workDuration);
  const [rounds, setRounds] = useState(exercise.rounds);

  const [working, setWorking] = useState(true); // Whether we're in a work session
  const [done, setDone] = useState(false); // Whether we've completed all rounds

  const toggleIcon = () => {
    const newIcon = icon == "play" || done ? "pause" : "play";
    setDone(false);
    setIcon(newIcon);
    // Toggle the sound effect playing when pausing/unpausing
    if (newIcon == "play") {
      setWasPlaying(status.playing);
      sound.pause();
    } else if (newIcon == "pause" && wasPlaying) {
      sound.play();
      setWasPlaying(false);
    }
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
  };

  // Count down the duration of the current session
  useEffect(() => {
    if (icon == "play" || done) return;

    const interval = setInterval(() => {
      const newSeconds = seconds - 1;
      setSeconds(newSeconds);
      if (seconds == 0) toggleSession();
      if (newSeconds > 0 && newSeconds <= 3 && !status.playing)
        sound.play(); // Play sound effect signalling the session change
    }, 1000);

    return () => clearInterval(interval);
  }, [icon, seconds]);

  const upcomingSession = () => {
    const secs = working ? exercise.restDuration : exercise.workDuration;
    return `${secs}s ${working ? "rest" : "work"}`;
  }

  return (
    <SwipeableCard maxXOffset={-50} style={styles.card}>
      <Container row style={styles.content}>
        <Container style={styles.infoColumn}>
          <ThemedText text={exercise.name} bold style={{ fontSize: fontSize["600"] }} />

          {/* Emphasize the current session */}
          <Container row>
            <ThemedText
              bold
              text={`${seconds} `}
              style={{ color: getColors().secondary["500"] }}
            />
            <ThemedText text={`s ${working ? "work" : "rest"}`} />
          </Container>

          <Container row style={{ width: "50%" }}>
            <ThemedText
              dimmed
              text={upcomingSession()}
              style={{ fontSize: fontSize["400"] }}
            />
            <ThemedText
              dimmed
              text={`x${rounds}`}
              style={{ fontSize: fontSize["400"], color: getColors().secondary["100"] }}
            />
          </Container>
        </Container>

        <ClickableIcon name={icon} transparent onPress={toggleIcon} />
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
      <Container row style={styles.content}>
        <Container style={styles.infoColumn}>
          <ThemedText text={exercise.name} bold style={{ fontSize: fontSize["600"] }} />

          <Container row>
            <ThemedText
              bold
              text={`${sets} `}
              style={{ color: getColors().secondary["500"] }}
            />
            <ThemedText text={`/ ${exercise.sets} sets`} />
          </Container>

          <Container row style={{ width: "50%" }}>
            <ThemedText
              dimmed
              text={`${exercise.reps} reps`}
              style={{ fontSize: fontSize["400"] }}
            />
            {exercise.weight > 0 &&
              <ThemedText
                dimmed
                text={`${exercise.weight} lbs`}
                style={{ fontSize: fontSize["400"] }}
              />
            }
          </Container>
        </Container>

        <ClickableIcon
          transparent
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

  const [requestQueue, setRequestQueue] = useStorage("requestQueue", []);
  const [token, _setToken] = useStorage("token", undefined);
  const [exercises, setExercises] = useStorage("exercises", []);
  const [currentDay, setCurrentDay] = useStorage("weekDay", new Date().getDay());
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  useEffect(() => { setCurrentDay(new Date().getDay()); }, []);

  const remove = (exercise: HIITExercise | StrengthExercise) => {
    const index = exercises.findIndex(e => {
      const a = e.rounds !== undefined;
      const b = exercise.rounds !== undefined;
      return e.name == exercise.name && e.weekDay == exercise.weekDay && a == b;
    });

    const name = exercises[index].name;
    const isHiit = exercises[index].rounds !== undefined;
    const copy = [...exercises];
    copy.splice(index, 1);
    setExercises(copy);

    const request = {
      method: "DELETE",
      endpoint: "/deleteExercise",
      body: { name, isHiit }, token,
   };
   setRequestQueue([...requestQueue, request]);
  };

  return (
    <Container background>
      <Container background row style={{ width: "100%", marginBottom: 10 }}>
        <ThemedText header text={`${days[currentDay]}'s exercises`} style={{ fontSize: fontSize["700"] }} />
        <ClickableIcon name="add" onPress={() => navigation.navigate("createExercise", {})} />
      </Container>

      <Selection options={days.map((day) => day[0])} selection={currentDay} setSelection={setCurrentDay} />

      {
        exercises.length > 0
          ? <FlatList
            data={exercises.filter((e) => e.weekDay == currentDay)}
            keyExtractor={(item) => `${item.name}-${item.weekDay}-${item.rounds}`}
            renderItem={({ item }) => {
              const isHiit = (item as HIITExercise).rounds !== undefined;
              return isHiit
                ? <HIITCard exercise={item} removeSelf={() => remove(item)} />
                : <StrengthCard exercise={item} removeSelf={() => remove(item)} />;
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
  },
  content: {
    width: "100%",
    paddingLeft: 5
  }
});
