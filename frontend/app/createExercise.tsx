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
  const [weekDay, _setWeekDay] = useStorage("weekDay", new Date().getDay());

  const [selection, setSelection] = useState(ExerciseType.Strength);
  const [hiit, setHiit] = useState<HIITExercise>(new HIITExercise(weekDay));
  const [strength, setStrength] = useState<StrengthExercise>(new StrengthExercise(weekDay));

  const [inputError, setInputError] = useState("");

  const currentExercise = () =>
    selection == ExerciseType.Strength ? strength : hiit;

  // Set the pre-existing values if we're editing an exercise
  useEffect(() => {
    const index = exercises.findIndex(e => e.id == routeParams["id"]);
    if (index == -1) return;

    let exercise = exercises[index];
    exercise.id = routeParams["id"];

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

  const createOrUpdateExercise = (id: number) => {
    const exercise = { ...currentExercise(), id: id };
    const copy = [...exercises];
    const index = copy.findIndex(e => e.id == id);
    if (index == -1) { // Create a new exercise
      copy.push(exercise);
    } else { // Update the exercise
      copy[index] = exercise;
    }
    setExercises(copy);
  };

  const saveEntry = () => {
    if (!isValid()) return;
    request({
      method: "POST",
      endpoint: "/update_exercise",
      body: { exercise: currentExercise() },
      onError: (msg: unknown) => console.log("ERROR", msg),
      handler: (response: object) => {
        if (!response.success) {
          // TODO: figure out what to do on error
          console.log("ERROR", response);
          return;
        }
        createOrUpdateExercise(response.id);
        navigation.goBack();
      }
    });
  };

  const setName = (value: string) => {
    setStrength({ ...strength, name: value });
    setHiit({ ...hiit, name: value });
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
