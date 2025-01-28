import * as Crypto from "expo-crypto";
import { useEffect, useState } from "react";

import { Button } from "@/components/buttons";
import { Container } from "@/components/containers";
import { Input } from "@/components/inputs";
import Logo from "@/components/logo";
import { ThemedText } from "@/components/text";
import getColors from "@/components/theme";

import request from "@/lib/http";
import useStorage from "@/lib/storage";

function validateInfo(email: string, password: string): string {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const specialCharacterRegex = /.*[!@#$%^&*(),.?":{}|<>].*/;
  const numberRegex = /.*\d.*/;

  if (!emailRegex.test(email)) {
    return "Invalid email";
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
  const [_weightEntries, setWeightEntries] = useStorage("weightEntries", {});
  const [_exercises, setExercises] = useStorage("exercises", []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const authenticate = async () => {
    const msg = validateInfo(email, password);
    setErrorMessage(msg);
    if (msg.length > 0) return;

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
          setErrorMessage(response.message ?? "Server side issue");
          return;
        }
        setToken(response.token);
      },
      onError: (_msg: unknown) => setErrorMessage("Couldn't connect to server"),
    })
  };

  // Fetch the user data onee the user is authenticated
  useEffect(() => {
    if (token === undefined) return;
    console.log(token);
    request({
      method: "GET", endpoint: "/userData", token,
      // Fall back on the user data stored locally
      onError: (_msg: unknown) => { setReady(true) },
      handler: (response: object) => {
        if (response.error) {
          // The json web token must be expired, so
          // force the user to authenticate again
          if (response.message == "Invalid token")
            setToken(undefined);
          console.log(`ERROR: ${JSON.stringify(response)}`);
          return;
        }

        // Put the user data in the local storage
        setWeightEntries(response["weightEntries"]);
        setExercises(response["exercises"]);
        setReady(true);
      }
    });
  }, [token]);

  return (
    <Container>
      <Logo style={{ width: 250, height: 200, marginTop: 50 }} />
      <Container style={{ width: "100%", gap: 15, height: "fit-content" }}>
        <ThemedText style={{ color: getColors().red }} text={errorMessage} />
        <Input value={email} placeholder="Email" setData={setEmail} keyboardType="email-address" />
        <Input value={password} placeholder="Password" setData={setPassword} />
        <ThemedText text="Forgot password?" style={{ alignSelf: "flex-start", fontSize: 12, marginBottom: 10 }} />
        <Button onPress={authenticate}>
          <ThemedText style={{ color: getColors().background["300"] }} text="Authenticate" />
        </Button>
      </Container>
    </Container >
  );
}
