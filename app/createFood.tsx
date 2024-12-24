import { Text, TextInput, ScrollView, View } from "react-native";
import { Stack, useNavigation } from "expo-router";
import { useState } from "react";

import { Button } from "@/app/components/Elements";
import { activeButton, stylesheet } from "./components/design";

interface MacroProps {
  label: string;
  unit: string;
  setData: (value: number) => void;
}

function Macro({ setData, label, unit }: MacroProps) {
  // Only to stop typescript from complaining
  const set = (data: string) => setData((data as unknown) as number);

  return (
    <View style={[stylesheet.row, { justifyContent: "flex-start" }]}>
      <Text style={{ width: 100 }}>{label}</Text>
      <TextInput
        placeholder="0"
        style={stylesheet.input}
        onChange={(event) => set(event.nativeEvent.text)}
        keyboardType="numeric" />
      <Text style={[ stylesheet.dimmed, { marginLeft: 10 } ]}>{unit}</Text>
    </View>
  )
}

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
            <Button label="✓" onPress={() => saveEntry()} styling={ activeButton } />
          }}
      />

      <TextInput
        placeholder="Name"
        style={ stylesheet.input }
        onChange={(event) => setName(event.nativeEvent.text)}
      />

      <Macro setData={setCalories} label="Calories" unit="kCal" />
      <Macro setData={setProtein} label="Protein" unit="g" />
      <Macro setData={setCarbs} label="Carbs" unit="g" />
      <Macro setData={setFats} label="Fat" unit="g" />
    </ScrollView>
  )
}
