import { Text } from "react-native";
import getTheme from "./theme";

interface TextProps {
  text: any;
  bold?: boolean;
  dimmed?: boolean;
  header?: boolean;
}

export function ThemedText({ text, bold, dimmed, header }: TextProps) {
  return (
    <Text
      style={{
        color: dimmed ? getTheme().textShade: getTheme().text,
        fontWeight: bold || header ? "bold" : "normal",
        fontSize: header ? 24 : 14,
      }}
    >
      {text}
    </Text>
  );
}
