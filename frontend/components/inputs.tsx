import { StyleSheet, StyleProp, TextInput, TextStyle } from "react-native";
import { Dispatch, SetStateAction } from "react";
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
  const set = (data: string) => setValue(data as unknown as number);
  const strValue = value !== undefined ? `${value}` : undefined;

  return (
    <Container row>
      {prefix.length > 0 && (
        <ThemedText
          text={prefix}
          style={[{ marginRight: 10, marginTop: -8 }, style]}
        />
      )}
      <Container row style={{ justifyContent: "flex-start" }}>
        <TextInput
          maxLength={10}
          defaultValue={strValue}
          placeholder="0"
          placeholderTextColor={getColors().text["300"]}
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
  value?: any;
  placeholder: string;
  setData: (value: string) => void | Dispatch<SetStateAction<any>>;
}

export function Input({ setData, placeholder, value }: InputProps) {
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={getColors().text["300"]}
      value={value}
      style={[styles.input, { width: "100%" }]}
      onChange={(event) => setData(event.nativeEvent.text.trim())}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    color: getColors().text["100"],
    backgroundColor: getColors().background["300"],
    borderBottomColor: getColors().primary["400"],
    borderBottomWidth: 2,
  },
});
