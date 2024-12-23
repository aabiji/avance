import { Text, View, TextInput } from "react-native";
import { Stack, useNavigation } from "expo-router";
import { useState } from "react";
import Button from "@/app/components/Button";

export default function CreateFood() {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState(0);

  const navigation = useNavigation();

  const saveEntry = () => {
    navigation.goBack();
    console.log(name, calories);
  };

  return (
    <View>
      <Stack.Screen
        options={{
          title: "Create food",
          headerRight: () =>
            <Button text="✓" onPress={() => saveEntry()} />
          }}
      />

      <TextInput onChange={(event) => setName(event.nativeEvent.text)} />

      <Text>
        <TextInput
          onChange={(event) => setCalories(event.nativeEvent.text)}
          keyboardType="numeric" />
        kCal
      </Text>
    </View>
  )
}

