import { Stack } from "expo-router";
import { ClickableIcon } from "./buttons";
import getColors from "./theme";

export default function Screen(
  { name, handleGoingBack }: { name: string, handleGoingBack: () => void }
) {
  return (
    <Stack.Screen
      options={{
        title: name,
        headerStyle: { backgroundColor: getColors().background["50"] },
        headerTitleStyle: { color: getColors().text["950"] },
        headerTintColor: getColors().text["950"], // Back button color
        headerRight: () => (
          <ClickableIcon
            transparent
            name="checkmark"
            onPress={() => handleGoingBack()}
          />
        ),
      }}
    />
  )
}