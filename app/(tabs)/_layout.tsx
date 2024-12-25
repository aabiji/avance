import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "../components/design";

export default function BottomNavbar() {
  return (
    <Tabs screenOptions={ ({ route }) => ({
        tabBarIcon: ({ focused, _, size }) => {
          const iconNames  = {
            "index": "scale-outline",
            "food": "restaurant-outline",
            "exercise": "barbell-outline",
          };
          const c = focused ? colors.blue : colors.darkestgrey;
          return <Ionicons name={iconNames[route.name]} size={size} color={c} />
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