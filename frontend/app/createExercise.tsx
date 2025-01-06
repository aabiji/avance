import { useNavigation, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";

import { View } from "react-native";

import { Container } from "@/components/containers";
import { Input, NumericInput } from "@/components/inputs";
import Selection from "@/components/selection";
import Screen from "@/components/screen";
import { ThemedText } from "@/components/text";
import getColors from "@/components/theme";

import request from "@/lib/http";
import useStorage from "@/lib/storage";

enum ExerciseType { Strength, HIIT }
// TODO: we already have another strEnumMembers function in index.tsx
const strEnumMembers = <T extends object>(enumType: T) =>
  Object.keys(enumType).filter((member) => isNaN(Number(member)));

export default function CreateExercise() {
  const [exercises, setExercises] = useStorage("exercises", []);
  const [inputError, setInputError] = useState("");
  const [selection, setSelection] = useState(ExerciseType.Strength);

  // TODO: this is dodgy....
  // TODO: fix all typescript errors
  const [name, setName] = useState(undefined);
  const [value1, setValue1] = useState(undefined);
  const [value2, setValue2] = useState(undefined);
  const [value3, setValue3] = useState(undefined);

  const navigation = useNavigation();
  const routeParams = useLocalSearchParams();

  // Create a new exercise depending on the type of exercise
  const exerciseObject = (): object => {
    const strength = {
      name: name,
      reps: value1,
      sets: value2,
      weight: value3
    };
    const hiit = {
      name: name,
      rounds: value1,
      workDuration: value2,
      restDuration: value3
    };
    return selection == ExerciseType.Strength ? strength : hiit;
  };

  // Set the pre-existing values if we're editing an exercise
  useEffect(() => {
    const key = routeParams["name"];
    if (key === undefined) return;

    const index = exercises.findIndex(e => e.name == key);
    const exercise = exercises[index];
    const isHIIT = exercise.rounds !== undefined;

    setSelection(isHIIT ? ExerciseType.HIIT : ExerciseType.Strength);
    setValue1(exercise.reps ?? exercise.rounds);
    setValue2(exercise.sets ?? exercise.restDuration);
    setValue3(exercise.weight ?? exercise.workDuration);
    setName(exercise.name);
  }, []);

  const createOrUpdateExercise = () => {
    const exercise = exerciseObject();
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
    // Make sure the user has entered in all the fields
    if (value1 === undefined || value2 === undefined ||
      value3 === undefined || name === undefined) {
      setInputError("Must fill out all fields");
      return;
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
        options={strEnumMembers(ExerciseType)}
        selection={selection}
        setSelection={setSelection}
      />

      <Input placeholder={"Name"} setData={setName} value={name} />

      {selection == 0 ? (
        <View style={{ width: "100%" }}>
          <NumericInput prefix="Reps" suffix="     " value={value1} setValue={setValue1} />
          <NumericInput prefix="Sets" suffix="     " value={value2} setValue={setValue2} />
          <NumericInput prefix="Weight" suffix="lbs" value={value3} setValue={setValue3} />
        </View>
      ) : (
        <View style={{ width: "100%" }}>
          <NumericInput prefix="Rounds" suffix="  " value={value1} setValue={setValue1} />
          <NumericInput prefix="Rest time" suffix="s" value={value2} setValue={setValue2} />
          <NumericInput prefix="Work time" suffix="s" value={value3} setValue={setValue3} />
        </View>
      )}
    </Container>
  );
}
