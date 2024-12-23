import { Text, View } from "react-native";
import { Link, Stack } from "expo-router";

import styles from "@/app/components/styles";
import  Button from "@/app/components/Button";

export default function FoodAdder() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Add food",
          headerRight: () =>
            <Button text="test" onPress={() => console.log("hello")} />
          }}
      />

      <Text>Search or create food </Text>
      <Link href="/createFood" asChild>
        <Button text="Create custom food"/>
      </Link>
    </View>
  )
}
