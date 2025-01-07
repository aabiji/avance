import { useNavigation, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";

import { View } from "react-native";

import { Container } from "@/components/containers";
import { Input, NumericInput } from "@/components/inputs";
import Selection from "@/components/selection";
import Screen from "@/components/screen";
import { ThemedText } from "@/components/text";
import getColors from "@/components/theme";

import { HIITExercise, StrengthExercise, ExerciseType } from "@/lib/types";
import request from "@/lib/http";
import useStorage from "@/lib/storage";

export default function CreateExercise() {
  const navigation = useNavigation();
  const routeParams = useLocalSearchParams();

  const [exercises, setExercises] = useStorage("exercises", []);
  const [inputError, setInputError] = useState("");
  const [selection, setSelection] = useState(ExerciseType.Strength);

  const [hiit, setHiit] = useState<HIITExercise>({});
  const [strength, setStrength] = useState<StrengthExercise>({});

  const currentExercise = (): object =>
    selection == ExerciseType.Strength ? strength : hiit;

  const setName = (value: string) => {
    if (selection == ExerciseType.Strength) {
      setStrength({ ...strength, name: value });
    } else {
      setHiit({ ...hiit, name: value });
    }
  }

  // Set the pre-existing values if we're editing an exercise
  useEffect(() => {
    const key = routeParams["name"];
    if (key === undefined) return;

    const index = exercises.findIndex(e => e.name == key);
    const exercise = exercises[index];
    const isHiit = exercise.rounds !== undefined;

    (isHiit) ? setHiit(exercise) : setStrength(exercise);
    setSelection(isHiit ? ExerciseType.HIIT : ExerciseType.Strength);
  }, []);

  const createOrUpdateExercise = () => {
    const exercise = currentExercise();
    let copy = [...exercises];
    const index = copy.findIndex(e => e.name == exercise.name);
    if (index == -1) { // Create a new exercise
      copy.push(exercise);
    } else { // Update the exercise
      copy[index] = exercise;
    }
    setExercises(copy);

    // TODO: figure out what to do on error
    request({
      endpoint: "/update_exercise",
      method: "POST", body: exercise,
      onError: (msg: unknown) => console.log("ERROR", msg),
      handler: (response: object) => {
        if (!response.success)
          console.log("ERROR", response);
      }
    })
  };

  const saveEntry = () => {
    // Validate the user input
    const exercise = currentExercise();
    for (const key of Object.keys(exercise)) {
      if (exercise[key] === undefined) {
        setInputError("Must fill out all fields");
        return;
      }

      // TODO: this isn't actually fixiing the underlying problem. Why are these strings in the first place?
      if (key != "name")
        exercise[key] = Number(exercise[key]);
    }
    createOrUpdateExercise();
    navigation.goBack();
  };


  return (
    <Container>
      <Screen name={"Create exercise"} handleGoingBack={saveEntry} />

      {inputError.length > 0 &&
        <ThemedText style={{ color: getColors().red }} text={inputError} />
      }

      <Selection
        selection={selection}
        setSelection={setSelection}
        options={Object.keys(ExerciseType).filter((member) => isNaN(Number(member)))}
      />

      <Input placeholder={"Name"} setData={setName} value={currentExercise().name} />

      {selection == ExerciseType.Strength ? (
        <View style={{ width: "100%" }}>
          <NumericInput
            prefix="Reps" suffix="     "
            value={strength.reps}
            setValue={(value: number) => setStrength({ ...strength, reps: value })}
          />
          <NumericInput
            prefix="Reps" suffix="     "
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
        <View style={{ width: "100%" }}>
          <NumericInput
            prefix="Rounds" suffix=" "
            value={hiit.rounds}
            setValue={(value: number) => setHiit({ ...hiit, rounds: value })}
          />
          <NumericInput
            prefix="Work time" suffix="x"
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
