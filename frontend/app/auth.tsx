import * as Crypto from "expo-crypto";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

import { Button } from "@/components/buttons";
import { Container } from "@/components/containers";
import { Input } from "@/components/inputs";
import Logo from "@/components/logo";
import { ThemedText } from "@/components/text";
import getColors, { fontSize } from "@/components/theme";

import request from "@/lib/http";
import useStorage from "@/lib/storage";
import { sameExercise } from "@/lib/types";

function validateInfo(email: string, password: string): string {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const specialCharacterRegex = /.*[!@#$%^&*(),.?":{}|<>].*/;
  const numberRegex = /.*\d.*/;

  if (!emailRegex.test(email)) {
    return "Please enter a valid email";
  }

  if (password.length < 8) {
    return "Password must be at least 8 digits long";
  }

  if (!specialCharacterRegex.test(password)) {
    return "Password must contain a special character";
  }

  if (!numberRegex.test(password)) {
    return "Password must contain a number";
  }

  return "";
}

export default function AuthPage({ setReady }) {
  const [token, setToken] = useStorage("token", undefined);
  const [weightEntries, setWeightEntries] = useStorage("weightEntries", {});
  const [exercises, setExercises] = useStorage("exercises", []);
  const [closeTimestamp, setCloseTimestamp] = useStorage("closeTimestamp", -1);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [alreadyAuthenticated, setAlreadyAuthenticated] = useState(false);

  const authenticate = async () => {
    const msg = validateInfo(email, password);
    setErrorMessage(msg);
    if (msg.length > 0) return;
    setLoading(true);

    request({
      endpoint: "/authenticate", method: "POST",
      body: {
        email,
        password: await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          password
        )
      },
      handler: (response: unknown) => {
        if (response.error) {
          setLoading(false);
          setErrorMessage(response.message ?? "Server side issue");
          return;
        }
        setToken(response.token);
        setCloseTimestamp(-1); // We want to fetch all of the user's data
      },
      onError: (_msg: unknown) => {
        setLoading(false);
        setErrorMessage("Couldn't connect to server");
      }
    })
  };

  // Update the user data in localstorage
  const updateUserData = (response: object) => {
    // Keys that now have different values will update on their own
    setWeightEntries({ ...weightEntries, ...response["weightEntries"] });

    let copy = [...exercises];
    for (const exercise of response["exercises"]) {
      const index = copy.findIndex(e => sameExercise(e, exercise));
      if (index != -1) {
        copy[index] = exercise;
      } else {
        copy.push(exercise);
      }
   }
   setExercises(copy);
  };

  // Fetch the user data onee the user is authenticated
  useEffect(() => {
    if (token === undefined) return;
    request({
      method: "POST",
      endpoint: "/userData",
      body: { startTimestamp: closeTimestamp }, token,
      onError: (_msg: unknown) => {
        // Fall back on the user data stored locally
        console.log("Server error");
        setReady(true);
      },
      handler: (response: object) => {
        setLoading(false);

        if (response.error) {
          // Force the user to authenticate again
          const errorMessages = ["Invalid token", "User not found"];
          if (errorMessages.includes(response.message)) {
            setToken(undefined);
            setAlreadyAuthenticated(false);
          }
          console.log(`ERROR: ${JSON.stringify(response)}`);
          setWeightEntries({});
          setExercises([]);
          return;
        }

        updateUserData(response);
       setReady(true);
      }
    });
  }, [token]);

  // Don't show the ui if the user is already authenticated
  useEffect(() => {
    if (token !== undefined)
      setAlreadyAuthenticated(true);
  }, []);
  if (alreadyAuthenticated)
    return null;

  return (
    <Container background>
      <Logo />
      <Container
        background
        style={{
          width: "100%", gap: 15,  marginTop: -35
        }}>
        <ThemedText style={{ color: getColors().red }} text={errorMessage} />
        <Input value={email} placeholder="Email" setData={setEmail} keyboardType="email-address" />
        <Input value={password} placeholder="Password" setData={setPassword} password />
        <ThemedText
          text="Forgot password?"
          style={{
            alignSelf: "flex-start", fontSize: fontSize["200"], marginBottom: 10
          }}
        />
        <Button onPress={authenticate}>
          {
            loading
              ? <ActivityIndicator color={getColors().background["50"]} />
              : <ThemedText
                style={{ color: getColors().background["50"] }}
                text="Continue"
              />
          }
        </Button>
      </Container>
    </Container>
  );
}