import { Stack, useNavigation } from "expo-router";
import { useState } from "react";

import { Container } from "@/components/containers";
import { ClickableIcon } from "@/components/buttons";
import { Input, NumericInput } from "@/components/inputs";

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
    <Container>
      <Stack.Screen
        options={{
          title: "Create food",
          headerRight: () => (
            <ClickableIcon name="checkmark" onPress={() => saveEntry()} />
          ),
        }}
      />

      <Input placeholder="Name" setData={setName} />

      <NumericInput setData={setCalories} prefix="Calories" suffix="kCal" />
      <NumericInput setData={setProtein} prefix="Protein" suffix="g" />
      <NumericInput setData={setCarbs} prefix="Carbs" suffix="g" />
      <NumericInput setData={setFats} prefix="Fat" suffix="g" />
    </Container>
  );
}
