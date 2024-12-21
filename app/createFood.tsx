import { Button, Text, View } from "react-native";
import { Link } from "expo-router";

export default function CreateFood() {
  return (
    <View>
      <Text>Search or create food </Text>
      <Link href="/addFood" dismissTo asChild>
        <Button title="✔️"/>
      </Link>
    </View>
  )
}

