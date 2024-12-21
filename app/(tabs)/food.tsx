import { Button, Text, View } from "react-native";
import { Link } from "expo-router";

export default function FoodTracker() {
  return (
    <View>
      <Text>500 / 1500 kCal</Text>
      <Link href="/addFood" asChild>
        <Button title="+"/>
      </Link>
    </View>
  )
}