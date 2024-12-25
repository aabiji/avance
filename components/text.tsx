import { Text } from "react-native";
import getTheme from "./theme";

interface TextProps {
  text: any;
  bold?: boolean;
  dimmed?: boolean;
  header?: boolean;
}

export function ThemedText({ text, bold, dimmed, header }: TextProps) {
  const isDimmed = dimmed !== undefined;
  const isBold = bold !== undefined;
  const isHeader = header !== undefined;

  return (
    <Text
      style={{
        color: isDimmed ? getTheme().text : getTheme().text,
        fontWeight: isBold || isHeader ? "bold" : "normal",
        fontSize: isHeader ? 24 : 14,
      }}
    >
      {text}
    </Text>
  );
}
