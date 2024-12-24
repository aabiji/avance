import { View } from "react-native";
import { Link } from "expo-router";

import { Button } from "@/app/components/Elements";
import { stylesheet, activeButton } from "@/app/components/design";

export default function Exercises() {
  return (
    <View style={stylesheet.container}>

      <Link href="/createExercise" asChild>
        <Button label="+" styling={ activeButton } />
      </Link>
    </View>
  )
}