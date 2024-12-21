import { Button, Text, View } from "react-native";
import { Link } from "expo-router";

export default function CreateExercise() {
  return (
    <View>
      <Text>Create new exercise </Text>
      <Link href="/exercise" dismissTo asChild>
        <Button title="✔️"/>
      </Link>
    </View>
  )
}


