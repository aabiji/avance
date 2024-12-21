import { Button, Text, View } from "react-native";
import { Link } from "expo-router";

export default function Exercises() {
  return (
    <View>
      <Text>Exercises go here</Text>
      <Link href="/createExercise" asChild>
        <Button title="+"/>
      </Link>
    </View>
  )
}