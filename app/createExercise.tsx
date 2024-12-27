import { View } from "react-native";
import { Stack } from "expo-router";
import { useNavigation } from "expo-router";
import { useState } from "react";

import { Container } from "@/components/containers";
import { ClickableIcon } from "@/components/buttons";
import { NumericInput } from "@/components/inputs";
import Selection from "@/components/selection";
import getTheme from "@/components/theme";

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
      <Stack.Screen
        options={{
          title: "Create exercise",
          headerStyle: { backgroundColor: getTheme().tabBar },
          headerTitleStyle: { color: getTheme().text },
          headerTintColor: getTheme().text,
          headerRight: () => (
            <ClickableIcon
              transparent
              name="checkmark"
              onPress={() => saveEntry()}
            />
          ),
        }}
      />

      <Selection
        options={["Resistance", "Interval"]}
        selection={selection}
        setSelection={setSelection}
      />

      {selection == 0 ? (
        <View>
          <NumericInput prefix="Weight" suffix="lbs" setData={setValue3} />
          <NumericInput prefix="# of reps" suffix="" setData={setValue1} />
          <NumericInput prefix="# of sets" suffix="" setData={setValue2} />
        </View>
      ) : (
        <View>
          <NumericInput prefix="# of rounds" suffix="" setData={setValue3} />
          <NumericInput prefix="Work time" suffix="s" setData={setValue1} />
          <NumericInput prefix="Rest time" suffix="s" setData={setValue2} />
        </View>
      )}
    </Container>
  );
}
