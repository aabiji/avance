import { Button, Text, View } from "react-native";
import { Link } from "expo-router";

export default function FoodAdder() {
  return (
    <View>
      <Text>Search or create food </Text>
      <Link href="/createFood" asChild>
        <Button title="Create custom food"/>
      </Link>
      <Link href="/food" dismissTo asChild>
        <Button title="✔️"/>
      </Link>
    </View>
  )
}
