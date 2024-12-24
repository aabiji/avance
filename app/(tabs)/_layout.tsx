import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function BottomNavbar() {
  return (
    <Tabs screenOptions={ ({ route }) => ({
        tabBarIcon: ({ _, color, size }) => {
          let iconNames = {
            "index": "scale-outline",
            "food": "restaurant-outline",
            "exercise": "barbell-outline",
          };
          return <Ionicons name={iconNames[route.name]} size={size} color={color} />
        },
        tabBarShowLabel: false,
        tabBarStyle: { marginBottom: -10 } // Remove bottom padding
      })}>
      <Tabs.Screen name="index" options={{ headerShown: false }} />
      <Tabs.Screen name="food" options={{  headerShown: false }} />
      <Tabs.Screen name="exercise" options={{ headerShown: false }} />
    </Tabs>
  )
}