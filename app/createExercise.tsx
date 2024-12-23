import { Text, View } from "react-native";
import { Stack } from "expo-router";
import { useNavigation } from "expo-router";
import Button from "@/app/components/Button";

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
            <Button text="✓" onPress={() => saveEntry()} />
          }}
      />
      <Text>hello?</Text>
    </View>
  )
}
