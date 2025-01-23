import { useState } from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/buttons";
import { Container } from "@/components/containers";
import { Input } from "@/components/inputs";
import { ThemedText } from "@/components/text";

// Here we show the login page, if the user has already logged in, setAuthenticated(true)
// If they're not, make them login/create an account, then setAuthenticated(true)
// If the user is logged in but their token expired, recreate a new jwt
// But for now, work on how the login/create account screen looks

export default function AuthPage({ setAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

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
      <ThemedText header text="Avance" /> {/*TODO: this should be our logo*/}
      <Button><Text>Authenticate with Google</Text></Button>
      <Text> Or continue with email </Text> {/*TODO: should be a line with OR in the middle separating the 2 modes of authentication*/}
      <View>
        <Input value={email} placeholder="Email" setData={setEmail} />
        {/*TODO: should be input type password */}
        <Input value={password} placeholder="Password" setData={setPassword} />
        <Button><Text>{isLogin ? "Login" : "Signup"}</Text></Button>
        <Text onPress={() => setIsLogin(!isLogin)}>
          {
            isLogin
              ? "Don't have an account"
              : "Already have an account?"
          }
        </Text>
      </View>
    </Container>
  );
}
