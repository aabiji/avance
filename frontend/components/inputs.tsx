import {
  Keyboard, KeyboardTypeOptions, StyleSheet,
  StyleProp, TextInput, TextStyle, View
} from "react-native";
import { Dispatch, SetStateAction, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Container } from "@/components/containers";
import { ThemedText } from "@/components/text";
import getColors from "./theme";

interface NumericInputProps {
  value?: any;
  style?: StyleProp<TextStyle>;
  prefix: string;
  suffix: string;
  setValue: (value: number) => void | Dispatch<SetStateAction<number>>;
}

export function NumericInput({
  style,
  prefix,
  suffix,
  setValue,
  value,
}: NumericInputProps) {
  // Only to stop typescript from complaining
  const set = (data: string) => setValue(Number(data));
  const strValue = value !== undefined ? `${value}` : undefined;

  return (
    <Container background row>
      {prefix.length > 0 && (
        <ThemedText
          text={prefix}
          style={[{ marginRight: 10, marginTop: -8 }, style]}
        />
      )}
      <Container background row style={{ justifyContent: "flex-start" }}>
        <TextInput
          maxLength={10}
          defaultValue={strValue}
          placeholder="0"
          placeholderTextColor={getColors().text["950"]}
          style={[styles.input, style]}
          onChange={(event) => set(event.nativeEvent.text)}
          keyboardType="numeric"
        />
        {suffix.length > 0 && (
          <ThemedText
            dimmed
            text={suffix}
            style={[{ marginLeft: 10, marginTop: -8 }, style]}
          />
        )}
      </Container>
    </Container>
  );
}

interface InputProps {
  placeholder: string;
  value?: any;
  keyboardType?: KeyboardTypeOptions | undefined;
  password?: boolean;
  setData: (value: string) => void | Dispatch<SetStateAction<any>>;
}

export function Input(
  { setData, placeholder, value, keyboardType, password }: InputProps
) {
  const [hidden, setHidden] = useState(password);
  const togglePasswordVisibility = () => {
    setHidden(!hidden);
    Keyboard.dismiss();
  };
  return (
    <View style={{ width: "100%", flexDirection: "row" }}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={getColors().text["400"]}
        value={value}
        style={[styles.input, { width: "100%" }]}
        onChange={(event) => setData(event.nativeEvent.text.trim())}
        keyboardType={keyboardType ?? "default"}
        secureTextEntry={hidden}
      />
      {password &&
        <Ionicons
          color={getColors().text["300"]} size={25}
          name={hidden ? "eye" : "eye-off"}
          onPress={togglePasswordVisibility}
          style={styles.eyeIcon}
        />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    color: getColors().text["950"],
    backgroundColor: getColors().primary["100"],
    borderRadius: 10,
  },
  eyeIcon: {
    top: 0,
    right: 55,
    height: 55,
    paddingVertical: 15,
    paddingHorizontal: 15
  }
});
