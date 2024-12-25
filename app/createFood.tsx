import { TextInput, ScrollView } from "react-native";
import { Stack, useNavigation } from "expo-router";
import { useState } from "react";

import { AlignedInput, Button } from "@/components/Elements";
import { colors, stylesheet, transparentButton } from "../components/design";

export default function CreateFood() {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fat, setFats] = useState(0);

  const navigation = useNavigation();

  const saveEntry = () => {
    navigation.goBack();
    console.log(name, calories, protein, carbs, fat);
  };

  return (
    <ScrollView style={ stylesheet.container }>
      <Stack.Screen
        options={{
          title: "Create food",
          headerRight: () =>
            <Button
              label="checkmark"
              hasIcon
              color={ colors.blue }
              onPress={() => saveEntry()} styling={ transparentButton }
            />
          }}
      />

      <TextInput
        placeholder="Name"
        style={ stylesheet.input }
        onChange={(event) => setName(event.nativeEvent.text)}
      />

      <AlignedInput setData={setCalories} prefix="Calories" suffix="kCal" />
      <AlignedInput setData={setProtein} prefix="Protein" suffix="g" />
      <AlignedInput setData={setCarbs} prefix="Carbs" suffix="g" />
      <AlignedInput setData={setFats} prefix="Fat" suffix="g" />
    </ScrollView>
  )
}
