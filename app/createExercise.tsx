import { View } from "react-native";
import { Stack } from "expo-router";
import { useNavigation } from "expo-router";
import { useState } from "react";

import { colors, labelButton, stylesheet, transparentButton } from "./components/design";
import { AlignedInput, Button, RadioButtonGroup } from "@/app/components/Elements";

export default function CreateExercise() {
  const [value1, setValue1] = useState(0);
  const [value2, setValue2] = useState(0);
  const [value3, setValue3] = useState(0);
  const [selection, setSelection] = useState(0);

  const navigation = useNavigation();

  const saveEntry = () => {
    navigation.goBack();
    console.log("saved exercise!", value1, value2, value3);
  }

  return (
    <View style={ stylesheet.container }>
      <Stack.Screen
        options={{
          title: "Create exercise",
          headerRight: () =>
            <Button
              label="checkmark"
              color={ colors.blue }
              hasIcon
              onPress={() => saveEntry()} styling={ transparentButton }
            />
          }}
      />

      <RadioButtonGroup
        options={["Interval", "Resistance"]}
        styling={ labelButton }
        selection={selection}
        setSelection={setSelection}
      />

      {
        selection == 0
        ? <View>
            <AlignedInput prefix="Weight" suffix="lbs" setData={setValue3} />
            <AlignedInput prefix="# of reps" suffix="" setData={setValue1} />
            <AlignedInput prefix="# of sets" suffix="" setData={setValue2} />
          </View>
        : <View>
            <AlignedInput prefix="# of rounds" suffix="" setData={setValue3} />
            <AlignedInput prefix="Work time" suffix="s" setData={setValue1} />
            <AlignedInput prefix="Rest time" suffix="s" setData={setValue2} />
          </View>
      }
    </View>
  )
}
