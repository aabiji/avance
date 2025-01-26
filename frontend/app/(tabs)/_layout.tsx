import { useState } from "react";

import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

import AuthPage from "@/app/auth";
import getColors from "@/components/theme";

function BottomNavbar() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          const iconNames: Record<string, string> = {
            index: "scale-outline",
            exercise: "barbell-outline",
          };
          const name = iconNames[route.name] as IoniconsName;
          const c = focused ? getColors().primary["200"] : getColors().text["300"];
          return <Ionicons name={name} size={size} color={c} />;
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          marginBottom: -10, // Remove bottom padding
          backgroundColor: getColors().background["300"],
          borderColor: getColors().background["300"],
        },
      })}
    >
      <Tabs.Screen name="index" options={{ headerShown: false }} />
      <Tabs.Screen name="exercise" options={{ headerShown: false }} />
    </Tabs>
  );
}

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  return ready ? <BottomNavbar /> : <AuthPage setReady={setReady} />
}
