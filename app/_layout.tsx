import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="addFood" options={{ title: "Add food" }} />
      <Stack.Screen name="createFood" options={{ title: "Create new food" }}/>
      <Stack.Screen name="createExercise" options={{ title: "Create new exercise" }} />
    </Stack>
  )
}