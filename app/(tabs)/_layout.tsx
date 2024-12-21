import { Tabs } from "expo-router";

export default function BottomNavbar() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Home", headerShown: false }} />
      <Tabs.Screen name="food" options={{ title: "Food", headerShown: false }} />
      <Tabs.Screen name="exercise" options={{ title: "Exercise", headerShown: false }} />
    </Tabs>
  )
}