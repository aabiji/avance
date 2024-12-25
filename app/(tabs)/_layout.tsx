import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

import getTheme from "@/components/theme";

export default function BottomNavbar() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, _, size }) => {
          const iconNames = {
            index: "scale-outline",
            food: "restaurant-outline",
            exercise: "barbell-outline",
          };
          const c = focused ? getTheme().accent : getTheme().textShade;
          return (
            <Ionicons name={iconNames[route.name]} size={size} color={c} />
          );
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          marginBottom: -10,
          backgroundColor: getTheme().tabBar,
          borderColor: getTheme().tabBar
        },
      })}
    >
      <Tabs.Screen name="index" options={{ headerShown: false }} />
      <Tabs.Screen name="food" options={{ headerShown: false }} />
      <Tabs.Screen name="exercise" options={{ headerShown: false }} />
    </Tabs>
  );
}
