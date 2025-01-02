import { View } from "react-native";
import { useNavigation } from "expo-router";
import { useState } from "react";

import { Container } from "@/components/containers";
import { NumericInput } from "@/components/inputs";
import Selection from "@/components/selection";
import Screen from "@/components/screen";

export default function CreateExercise() {
  const [value1, setValue1] = useState(0);
  const [value2, setValue2] = useState(0);
  const [value3, setValue3] = useState(0);
  const [selection, setSelection] = useState(0);

  const navigation = useNavigation();

  const saveEntry = () => {
    navigation.goBack();
    console.log("saved exercise!", value1, value2, value3);
  };

  return (
    <Container>
      <Screen name={"Create exercise"} handleGoingBack={saveEntry} />

      <Selection
        options={["Strength", "HIIT"]}
        selection={selection}
        setSelection={setSelection}
      />

      {selection == 0 ? (
        <View style={{ width: "100%" }}>
          <NumericInput prefix="Reps" suffix="     " setValue={setValue1} />
          <NumericInput prefix="Sets" suffix="     " setValue={setValue2} />
          <NumericInput prefix="Weight" suffix="lbs" setValue={setValue3} />
        </View>
      ) : (
        <View style={{ width: "100%" }}>
          <NumericInput prefix="Rounds" suffix="  " setValue={setValue3} />
          <NumericInput prefix="Rest time" suffix="s" setValue={setValue2} />
          <NumericInput prefix="Work time" suffix="s" setValue={setValue1} />
        </View>
      )}
    </Container>
  );
}
