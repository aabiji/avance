import { Text, Pressable, View } from "react-native";
import { forwardRef, ForwardedRef, useState } from "react";

interface ButtonProps {
  label: string;
  onPress?: () => void,
  styling: (pressed: boolean) => object,
  textColor?: string,
}

export const Button = forwardRef((
  { label: text, onPress, styling, textColor }: ButtonProps,
  ref: ForwardedRef<any>
) => {
  return (
    <Pressable
      ref={ref}
      onPressIn={onPress}
      style={({ pressed }) => styling(pressed)}>
      <Text style={{ color: textColor ?? "white" }}>{text}</Text>
    </Pressable>
  )
});

export function RadioButtonGroup(
  { options, styling }:
  { options: string[], styling: (pressed: boolean) => object }
) {
  const [selection, setSelection] = useState(0);
  const [selected, unselected] = [styling(true), styling(false)];

  return (
    <View style={{ minHeight: 50, flexDirection: "row" }}>
      {options.map((option, index) =>
          <Button
            key={index}
            label={option}
            styling={(_) => index == selection ? selected : unselected}
            onPress={() => setSelection(index)}
            textColor={index == selection ? selected.color : unselected.color}
          />
      )}
    </View>
  )
}

export default Button;