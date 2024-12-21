import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="addFood" />
      <Stack.Screen name="createFood" />
      <Stack.Screen name="createExercise" />
    </Stack>
  )
}