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
  const [bg, color] = [getColors().background["300"], getColors().primary["200"]];
  return (
    <View style={[styles.container, style]}>
      {options.map((option, index) => (
        <Pressable
          key={index}
          onPressIn={() => setSelection(index)}
          style={[
            styles.button,
            { backgroundColor: index == selection ? color : bg },
          ]}
        >
          <Text
            style={{ color: index == selection ? bg : color, textAlign: "center" }}
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
    marginBottom: 25,
    overflow: "hidden",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: getColors().primary["200"]
  },
  button: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 8,
  }
});
