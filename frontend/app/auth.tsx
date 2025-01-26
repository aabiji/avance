import { useState } from "react";
import { Appearance, Platform, Text, View } from "react-native";

import { Button } from "@/components/buttons";
import { Container } from "@/components/containers";
import { Input } from "@/components/inputs";
import { ThemedText } from "@/components/text";

import GoogleAuthAndroidDark from "@/assets/google-auth-android-dark.svg";
import GoogleAuthAndroidLight from "@/assets/google-auth-android-light.svg";
import GoogleAuthIOSDark from "@/assets/google-auth-ios-dark.svg";
import GoogleAuthIOSLight from "@/assets/google-auth-ios-light.svg";
function AuthIcon() {
  //const dark = Appearance.getColorScheme() === "dark";
  //if (Platform.OS === "android") {
  //  return dark ? <GoogleAuthAndroidDark /> : <GoogleAuthAndroidLight />;
  //}
  //return dark ? <GoogleAuthIOSDark /> : <GoogleAuthIOSLight />;
  return <Text>something</Text>;
}

export default function AuthPage({ setAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /*
  const handleGoogleLogin = async () => {
    const token = response?.authentication?.accessToken;
    const res = fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const user = await res.json();
    console.log(user);
  }

  useEffect(() => {
    if (response?.type === "success")
      handleGoogleLogin();
  }, [response]);
  */

  /*
  const [_weightEntries, setWeightEntries] = useStorage("weightEntries", {});
  const [_exercises, setExercises] = useStorage("exercises", []);
  const [userId, setUserId] = useStorage("userId", -1);
  setUserId(1);

  // Update the user data that's stored locally
  useEffect(() => {
    request({
      method: "POST", endpoint: "/userData",
      body: { userId: userId },

      // TODO: figure out what to do on error --
      //       if the user already logged in, we can just rely on localstorage,
      //       but if they're not, then I guess they can't use the app
      onError: (_msg: unknown) => { setAuthenticated(true) },

      handler: (response: object) => {
        // TODO: figure out what to do on error (see above)
        if (response.error) {
          console.log(`ERROR: ${JSON.stringify(response)}`);
          return;
        }

        // Put the user data in the local storage
        setWeightEntries(response["weightEntries"]);
        setExercises(response["exercises"]);
        setAuthenticated(true);
      }
    });
  }, []);
  */

  return (
    <Container>
      <ThemedText header text="Avance" />
      <Button><AuthIcon /></Button>
      <View>
        <Input value={email} placeholder="Email" setData={setEmail} />
        <Input value={password} placeholder="Password" setData={setPassword} />
        <Button><Text>Continue with email</Text></Button>
      </View>
    </Container>
  );
}
