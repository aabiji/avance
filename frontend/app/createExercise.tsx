import { useNavigation } from "expo-router";
import { useState } from "react";

import { View } from "react-native";

import { Container } from "@/components/containers";
import getColors from "@/components/theme";
import { Input, NumericInput } from "@/components/inputs";
import Selection from "@/components/selection";
import Screen from "@/components/screen";
import { ThemedText } from "@/components/text";

import request from "@/lib/http";
import useStorage from "@/lib/storage";

export default function CreateExercise() {
  const [exercises, setExercises] = useStorage("exercises", []);
  const [inputError, setInputError] = useState("");

  const [value1, setValue1] = useState(-1);
  const [value2, setValue2] = useState(-1);
  const [value3, setValue3] = useState(-1);
  const [name, setName] = useState("");
  const [selection, setSelection] = useState(0);
  const navigation = useNavigation();

  const createNewExercise = () => {
    const strength = { name: name, reps: value1, sets: value2, weight: value3 };
    const hiit = { name: name, rounds: value1, workTime: value2, restTime: value3 };
    const newExercise = selection == 0 ? strength : hiit;

    const copy = [...exercises];
    copy.push(newExercise);
    setExercises(copy);

    // TODO: figure out what to do on error
    request({
      endpoint: "/create_exercise",
      method: "POST", body: newExercise,
      onError: (msg: unknown) => console.log("ERROR", msg),
      handler: (response: object) => {
        if (!response.success)
          console.log("ERROR", response);
      }
    })
  };

  const saveEntry = () => {
    // Make sure the user has entered in all the fields
    if (value1 == -1 || value2 == -1 || value3 == -1 || name == "") {
      setInputError("Must fill out all fields");
      return;
    }
    createNewExercise();
    navigation.goBack();
  };

  return (
    <Container>
      <Screen name={"Create exercise"} handleGoingBack={saveEntry} />

      {inputError.length > 0 &&
        <ThemedText style={{ color: getColors().red }} text={inputError} />
      }

      <Selection
        options={["Strength", "HIIT"]}
        selection={selection}
        setSelection={setSelection}
      />

      <Input placeholder={"Name"} setData={setName} />

      {selection == 0 ? (
        <View style={{ width: "100%" }}>
          <NumericInput prefix="Reps" suffix="     " setValue={setValue1} />
          <NumericInput prefix="Sets" suffix="     " setValue={setValue2} />
          <NumericInput prefix="Weight" suffix="lbs" setValue={setValue3} />
        </View>
      ) : (
        <View style={{ width: "100%" }}>
          <NumericInput prefix="Rounds" suffix="  " setValue={setValue1} />
          <NumericInput prefix="Rest time" suffix="s" setValue={setValue2} />
          <NumericInput prefix="Work time" suffix="s" setValue={setValue3} />
        </View>
      )}
    </Container>
  );
}
