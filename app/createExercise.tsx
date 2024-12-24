import { Text, View } from "react-native";
import { Stack } from "expo-router";
import { useNavigation } from "expo-router";

import { activeButton, labelButton, stylesheet } from "./components/design";
import { Button, RadioButtonGroup } from "@/app/components/Elements";

export default function CreateExercise() {
  const navigation = useNavigation();

  const saveEntry = () => {
    console.log("saved exercise!");
    navigation.goBack();
  }

  return (
    <View style={ stylesheet.container }>
      <Stack.Screen
        options={{
          title: "Create exercise",
          headerRight: () =>
            <Button label="✓" onPress={() => saveEntry()} styling={ activeButton } />
          }}
      />
      <RadioButtonGroup options={["Interval", "Resistance"]} styling={ labelButton } />
      <Text>hello?</Text>
    </View>
  )
}
