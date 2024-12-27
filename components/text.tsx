import { Text } from "react-native";
import { fontSize, getTheme } from "./theme";

interface TextProps {
  text: any;
  bold?: boolean;
  dimmed?: boolean;
  header?: boolean;
}

export function ThemedText({ style, text, bold, dimmed, header }: TextProps) {
  return (
    <Text
      style={[
        {
          color: dimmed ? getTheme().textShade : getTheme().text,
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
