import { Text, View } from "react-native";
import { Link } from "expo-router";
import Button from "@/app/components/Button";
import styles from "@/app/components/styles";

export default function Exercises() {
  return (
    <View style={styles.container}>
      <Text>Exercises go here</Text>

      <Link href="/createExercise" asChild>
        <Button text="+"/>
      </Link>
    </View>
  )
}