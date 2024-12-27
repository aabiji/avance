import { StyleSheet, TextInput } from "react-native";
import { Row } from "@/components/containers";
import { ThemedText } from "@/components/text";
import getTheme from "./theme";

export function NumericInput({ style, prefix, suffix, setData, value }) {
  // Only to stop typescript from complaining
  const set = (data: string) => setData(data as unknown as number);

  return (
    <Row>
      {prefix.length > 0 && (
        <ThemedText
          text={prefix}
          style={[{ marginRight: 10, marginTop: -8 }, style]}
        />
      )}
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
    </Row>
  );
}

export function Input({ setData, placeholder }) {
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
