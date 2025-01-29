import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Dispatch, SetStateAction } from "react";
import getColors from "./theme";

interface SelectionProps {
  options: string[];
  selection: number;
  setSelection: Dispatch<SetStateAction<number>>;
  style?: StyleProp<ViewStyle>;
}

export default function Selection({
  options,
  selection,
  setSelection,
  style
}: SelectionProps) {
  const [bg, color] = [getColors().primary["500"], getColors().background["50"]];
  return (
    <View style={[styles.container, style]}>
      {options.map((option, index) => (
        <Pressable
          key={index}
          onPressIn={() => setSelection(index)}
          style={[
            styles.button,
            { backgroundColor: index == selection ? bg : color },
          ]}
        >
          <Text
            style={{ color: index == selection ? color : bg, textAlign: "center" }}
          >
            {option}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 15,
  },
  button: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 8,
  }
});
