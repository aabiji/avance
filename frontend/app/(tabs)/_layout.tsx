import { AppState } from "react-native";
import { useState, useEffect, useRef } from "react";

import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

import AuthPage from "@/app/auth";
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
          const c = focused ? getColors().primary["500"] : getColors().accent["300"];
          return <Ionicons name={name} size={size} color={c} />;
        },
        tabBarShowLabel: false,
        tabBarStyle: {
          marginBottom: -10, // Remove bottom padding
          backgroundColor: getColors().background["50"],
          borderColor: getColors().background["100"],
        },
      })}
    >
      <Tabs.Screen name="index" options={{ headerShown: false }} />
      <Tabs.Screen name="exercise" options={{ headerShown: false }} />
    </Tabs>
  );
}

export default function RootLayout() {
  // THe time at which the app was closed
  const [_closeTimestamp, setCloseTimestamp] = useStorage("closeTimestamp", -1);
  const [requestQueue, setRequestQueue] = useStorage("requestQueue", []);
  const [alreadyClosed, setAlreadyClosed] = useState(false);

  const queueRef = useRef(requestQueue);
  useEffect(() => {
    queueRef.current = requestQueue;
  }, [requestQueue]);

  const syncToServer = (state: string) => {
    if (state !== "background" || alreadyClosed) return;

    // Call all of the requests that have been queued when the app closes. If a
    // request fails because of a server issue, then put it back into the queue.
    const failedRequests: RequestInfo[] = [];
    for (const requestInfo of queueRef.current) {
      const info = {
        ...requestInfo,
        onHandler: () => { },
        onError: () => failedRequests.push(requestInfo)
      }
      request(info);
    }

    setRequestQueue(failedRequests);
    setCloseTimestamp(Date.now());
    setAlreadyClosed(true);
  };

  useEffect(() => {
    AppState.addEventListener("change", syncToServer);
  }, []);

  const [ready, setReady] = useState(false);
  return ready ? <BottomNavbar /> : <AuthPage setReady={setReady} />
}