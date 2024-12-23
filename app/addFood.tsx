import { NativeSyntheticEvent, TextInput, TextInputFocusEventData, View } from "react-native";
import { Link, Stack, useNavigation } from "expo-router";

import styles from "@/app/components/styles";
import  Button from "@/app/components/Button";

function search(e: NativeSyntheticEvent<TextInputFocusEventData>) {
  const input = e.nativeEvent.text;
  console.log(input);
}

export default function FoodAdder() {
  const navigation = useNavigation();

  const saveSelection = () => {
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Add food",
          headerRight: () =>
            <Button text="✓" onPress={() => saveSelection()} />
          }}
      />

      <TextInput onChange={(event) => search(event)} />

      <Link href="/createFood" asChild>
        <Button text="Create custom food"/>
      </Link>
    </View>
  )
}
