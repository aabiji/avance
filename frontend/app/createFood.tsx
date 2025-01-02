import { useNavigation } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import { Container } from "@/components/containers";
import { Input, NumericInput } from "@/components/inputs";
import Screen from "@/components/screen";

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
      <Screen name={"Create food"} handleGoingBack={saveEntry} />

      <Input placeholder="Name" setData={setName} />

      <View style={{ width: "100%" }}>
        <NumericInput setValue={setCalories} prefix="Calories" suffix="cal" />
        <NumericInput setValue={setProtein} prefix="Protein" suffix="g   " />
        <NumericInput setValue={setCarbs} prefix="Carbs" suffix="g   " />
        <NumericInput setValue={setFats} prefix="Fat" suffix="g   " />
      </View>
    </Container>
  );
}
