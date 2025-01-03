import { Tabs } from "expo-router";
import getColors from "@/components/theme";

import Ionicons from "@expo/vector-icons/Ionicons";
type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

export default function BottomNavbar() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const iconNames: Record<string, string> = {
            index: "scale-outline",
            food: "restaurant-outline",
            exercise: "barbell-outline",
          };
          const name = iconNames[route.name] as IoniconsName;
          const c = focused ? getColors().primary["200"] : getColors().text["300"];
          return <Ionicons name={name} size={size} color={c} />;
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          marginBottom: -10,
          backgroundColor: getColors().background["300"],
          borderColor: getColors().background["300"],
        },
      })}
    >
      <Tabs.Screen name="index" options={{ headerShown: false }} />
      <Tabs.Screen name="food" options={{ headerShown: false }} />
      <Tabs.Screen name="exercise" options={{ headerShown: false }} />
    </Tabs>
  );
}
