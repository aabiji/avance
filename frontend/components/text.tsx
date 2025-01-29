import { Text, TextStyle, StyleProp } from "react-native";
import { fontSize, getColors } from "./theme";

interface TextProps {
  text: any;
  bold?: boolean;
  dimmed?: boolean;
  header?: boolean;
  style?: StyleProp<TextStyle>;
}

export function ThemedText({ style, text, bold, dimmed, header }: TextProps) {
  return (
    <Text
      style={[
        {
          color: dimmed ? getColors().text["500"] : getColors().text["950"],
          fontWeight: bold || header ? "bold" : "normal",
          fontSize: header ? fontSize["800"] : fontSize["500"],
        },
        style,
      ]}
    >
      {text}
    </Text>
  );
}
