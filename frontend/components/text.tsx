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
          color: dimmed ? getColors().text["200"] : getColors().text["100"],
          fontWeight: bold || header ? "bold" : "normal",
          fontSize: header ? fontSize.big : fontSize.normal,
        },
        style,
      ]}
    >
      {text}
    </Text>
  );
}
