import { Tabs } from "expo-router";

export default function BottomNavbar() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Home", headerShown: false }} />
    </Tabs>
  )
}