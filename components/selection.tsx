import { Pressable, StyleSheet, Text, View } from "react-native";
import getTheme from "./theme";

export default function Selection({ options, selection, setSelection }) {
  const [transparent, bg, accent] = [
    "#ffffff00",
    getTheme().background,
    getTheme().accent,
  ];
  return (
    <View style={styles.container}>
      {options.map((option, index) => (
        <Pressable
          key={index}
          onPressIn={() => setSelection(index)}
          style={[
            styles.button,
            {
              borderColor: index == selection ? transparent : accent,
              backgroundColor: index == selection ? accent : transparent,
            },
          ]}
        >
          <Text
            style={[styles.text, { color: index == selection ? bg : accent }]}
          >
            {option}
          </Text>
        </Pressable>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 25,
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 2,
    borderRightWidth: 1,
    flex: 1, // Fill remaining horizantal space
  },
  text: {
    color: getTheme().accent,
    textAlign: "center",
  },
});
