import { View, Text } from "react-native";
import { Link } from "expo-router";

import { Button } from "@/app/components/Elements";
import { stylesheet, activeButton } from "@/app/components/design";

export default function Exercises() {
  return (
    <View style={stylesheet.container}>

      <View style={[stylesheet.row, { width: "100%" }]}>
        <Text style={[stylesheet.text, stylesheet.header]}>Exercises</Text>
        <Link href="/createExercise" asChild>
          <Button label="+" styling={ activeButton } />
        </Link>
      </View>

    </View>
  )
}