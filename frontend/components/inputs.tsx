import { StyleSheet, StyleProp, TextInput, TextStyle } from "react-native";
import { Dispatch, SetStateAction } from "react";
import { Container } from "@/components/containers";
import { ThemedText } from "@/components/text";
import getTheme from "./theme";

interface NumericInputProps {
  value?: string;
  style?: StyleProp<TextStyle>;
  prefix: string;
  suffix: string;
  setValue: Dispatch<SetStateAction<number>>;
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
          defaultValue={value}
          placeholder="0"
          placeholderTextColor={getTheme().textShade}
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
  setData: Dispatch<SetStateAction<any>>;
}

export function Input({ setData, placeholder }: InputProps) {
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={getTheme().textShade}
      style={[styles.input, { width: "100%" }]}
      onChange={(event) => setData(event.nativeEvent.text)}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: getTheme().background,
    borderColor: getTheme().textShade,
    color: getTheme().text,
    borderStyle: "solid",
    borderWidth: 1,
    marginBottom: 10,
  },
});
