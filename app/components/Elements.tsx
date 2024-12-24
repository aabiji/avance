import { Text, Pressable, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { forwardRef, ForwardedRef, useState } from "react";
import { labelButton } from "./design";

type ButtonProps = {
  label: string;
  onPress?: () => void;
  styling: (pressed: boolean) => object;
};

export const Button = forwardRef(function BasicButton(
  { label: text, onPress, styling }: ButtonProps,
  ref: ForwardedRef<any>) {
  return (
    <Pressable
      ref={ref}
      onPressIn={onPress}
      style={({ pressed }) => styling(pressed)}>
      <Text style={{ color: "white" }}>{text}</Text>
    </Pressable>
  )
});

export function RadioButtonGroup({ options }: { options: string[] }) {
  const [selection, setSelection] = useState(0);

  return (
    <View style={{ minHeight: 50, flexDirection: "row" }}>
      {options.map((option, index) =>
          <Button
            key={index}
            label={option}
            styling={(_) => index == selection ? labelButton(true) : labelButton(false)}
            onPress={() => setSelection(index)}
          />
      )}
    </View>
  )
}

export function GradientSeparator({ colors }: { colors: string[] }) {
  return (
      <LinearGradient
        colors={colors}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={{ height: 8, marginTop: 10, marginBottom: 10, borderRadius: 5 }} />
  )
}

export default Button;