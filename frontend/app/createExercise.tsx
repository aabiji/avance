import { useNavigation, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";

import { View } from "react-native";

import { Container } from "@/components/containers";
import { Input, NumericInput } from "@/components/inputs";
import Selection from "@/components/selection";
import Screen from "@/components/screen";
import { ThemedText } from "@/components/text";
import getColors from "@/components/theme";

import {
  HIITExercise, StrengthExercise, ExerciseType, sameExercise
} from "@/lib/types";
import useStorage from "@/lib/storage";

export default function CreateExercise() {
  const navigation = useNavigation();
  const routeParams = useLocalSearchParams();

  const [token, _setToken] = useStorage("token", undefined);
  const [exercises, setExercises] = useStorage("exercises", []);
  const [weekDay, _setWeekDay] = useStorage("weekDay", new Date().getDay());
  const [requestQueue, setRequestQueue] = useStorage("requestQueue", []);

  const [selection, setSelection] = useState(ExerciseType.Strength);
  const [hiit, setHiit] = useState<HIITExercise>(new HIITExercise(weekDay));
  const [strength, setStrength] = useState<StrengthExercise>(new StrengthExercise(weekDay));

  const [inputError, setInputError] = useState("");

  const currentExercise = () =>
    selection == ExerciseType.Strength ? strength : hiit;

  const findExisting = (exercise: HIITExercise | StrengthExercise) =>
    exercises.findIndex(e => sameExercise(e, exercise));

  // Set the pre-existing values if we're editing an exercise
  useEffect(() => {
    if (routeParams["previousExercise"] === undefined) return;
    const index = findExisting(JSON.parse(routeParams["previousExercise"]));
    if (index == -1) return;

    const exercise = exercises[index];
    const isHiit = exercise.rounds !== undefined;
    (isHiit) ? setHiit(exercise) : setStrength(exercise);
    setSelection(isHiit ? ExerciseType.HIIT : ExerciseType.Strength);
  }, []);

  const isValid = () => {
    // Make sure all the data is filled out
    const exercise = currentExercise();
    for (const key of Object.keys(exercise)) {
      if (exercise[key] === undefined) {
        setInputError("Must fill out all fields");
        return false;
      }
    }
    return true;
  };

  const createOrUpdateExercise = () => {
    const exercise = { ...currentExercise(), weekDay: weekDay };
    const copy = [...exercises];
    const index = findExisting(exercise);
    if (index == -1) { // Create a new exercise
      copy.push(exercise);
    } else { // Update the exercise
      copy[index] = exercise;
    }
    setExercises(copy);
  };

  const saveEntry = () => {
    if (!isValid()) return;
    const request = {
      method: "POST", token,
      endpoint: "/updateExercise",
      body: {
        weekDay,
        strength: selection == ExerciseType.Strength ? strength : undefined,
        hiit: selection == ExerciseType.Strength ? undefined : hiit
      }
    };
    setRequestQueue([...requestQueue, request]);
    createOrUpdateExercise();
    navigation.goBack();
  };

  const setName = (value: string) => {
    setStrength({ ...strength, name: value });
    setHiit({ ...hiit, name: value });
  };

  return (
    <Container background>
      <Screen name={"Create exercise"} handleGoingBack={saveEntry} />

      <Selection
        selection={selection}
        setSelection={setSelection}
        options={Object.keys(ExerciseType).filter((member) => isNaN(Number(member)))}
      />

      {inputError.length > 0 &&
        <ThemedText
          style={{ color: getColors().red, marginTop: -5, marginBottom: 10 }}
          text={inputError}
        />
      }

      <Input placeholder={"Name"} setData={setName} value={currentExercise().name} />

      {selection == ExerciseType.Strength ? (
        <View style={{ width: "98%" }}>
          <NumericInput
            prefix="Reps" suffix="     "
            value={strength.reps}
            setValue={(value: number) => setStrength({ ...strength, reps: value })}
          />
          <NumericInput
            prefix="Sets" suffix="     "
            value={strength.sets}
            setValue={(value: number) => setStrength({ ...strength, sets: value })}
          />
          <NumericInput
            prefix="Weight" suffix="lbs"
            value={strength.weight}
            setValue={(value: number) => setStrength({ ...strength, weight: value })}
          />
        </View>
      ) : (
        <View style={{ width: "98%" }}>
          <NumericInput
            prefix="Rounds" suffix="  "
            value={hiit.rounds}
            setValue={(value: number) => setHiit({ ...hiit, rounds: value })}
          />
          <NumericInput
            prefix="Work time" suffix="s"
            value={hiit.workDuration}
            setValue={(value: number) => setHiit({ ...hiit, workDuration: value })}
          />
          <NumericInput
            prefix="Rest time" suffix="s"
            value={hiit.restDuration}
            setValue={(value: number) => setHiit({ ...hiit, restDuration: value })}
          />
        </View>
      )}
    </Container>
  );
}
