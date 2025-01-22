import { useState, useEffect, useCallback } from "react";
import { View } from "react-native";

import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { Tabs } from "expo-router";

import Ionicons from "@expo/vector-icons/Ionicons";
type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

import getColors from "@/components/theme";

import request from "@/lib/http";
import useStorage from "@/lib/storage";

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

// Keep the splashscreen visible while we fetch ressources
SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({ duration: 3000, fade: false });

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [_weightEntries, setWeightEntries] = useStorage("weightEntries", {});
  const [_exercises, setExercises] = useStorage("exercises", []);

  // TODO: we should be storing a jwt instead
  const [userId, setUserId] = useStorage("userId", -1);
  setUserId(1);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync(Ionicons.font);

        // Update the user data that's stored locally
        request({
          method: "POST", endpoint: "/userData",
          body: { userId: userId },

          // Don't do anything when we error trying to call the api.
          // For example, in the event that the user is disconnected from the
          // internet, the app will just fallback on the data stored locally.
          // TODO: we should send data we meant to send when we can if a request fails
          onError: (_msg: unknown) => { setReady(true) },

          handler: (response: object) => {
            // TODO: figure out what to do on error
            if (response.error) {
              console.log(`ERROR: ${JSON.stringify(response)}`);
              return;
            }

            // Put the user data in the local storage
            setWeightEntries(response["weightEntries"]);
            setExercises(response["exercises"]);

            setReady(true);
          }
        });
      } catch (error) {
        console.warn(error);
      }
    }

    prepare();
  }, []);

  const onLayout = useCallback(() => {
    if (ready) SplashScreen.hide();
  }, [ready]);

  if (!ready) return null;

  return (
    <View onLayout={onLayout} style={{ flex: 1 }}>
      <BottomNavbar />
    </View>
  );
}
