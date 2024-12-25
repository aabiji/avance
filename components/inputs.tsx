import { StyleSheet, Text, TextInput } from "react-native";
import { Row } from "@/components/containers";
import { ThemedText } from "@/components/text";
import getTheme from "./theme";

export function NumericInput({ prefix, suffix, setData }) {
  // Only to stop typescript from complaining
  const set = (data: string) => setData(data as unknown as number);

  return (
    <Row>
      <Text style={styles.left}>{prefix}</Text>
      <TextInput
        placeholder="0"
        style={styles.input}
        onChange={(event) => set(event.nativeEvent.text)}
        keyboardType="numeric"
      />
      <ThemedText dimmed text={suffix} />
    </Row>
  );
}

export function Input({ setData, placeholder }) {
  return (
    <TextInput
      placeholder={placeholder}
      style={[ styles.input, { width: "100%" } ]}
      onChange={(event) => setData(event.nativeEvent.text)}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: getTheme().background,
    borderColor: getTheme().secondary,
    borderStyle: "solid",
    borderWidth: 1,
    marginBottom: 10,
    marginRight: 10,
  },
  left: {
    width: 100,
  },
});
