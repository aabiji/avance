import { Text, View } from "react-native";
import { Stack } from "expo-router";
import { useNavigation } from "expo-router";

import { activeButton } from "./components/design";
import { Button, RadioButtonGroup } from "@/app/components/Elements";

export default function CreateExercise() {
  const navigation = useNavigation();

  const saveEntry = () => {
    console.log("saved exercise!");
    navigation.goBack();
  }

  return (
    <View>
      <Stack.Screen
        options={{
          title: "Create exercise",
          headerRight: () =>
            <Button label="✓" onPress={() => saveEntry()} styling={ activeButton } />
          }}
      />
      <RadioButtonGroup options={["Interval", "Resistance"]} />
      <Text>hello?</Text>
    </View>
  )
}
