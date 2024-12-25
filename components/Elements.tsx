import { Text, TextInput, Pressable, View } from "react-native";
import { forwardRef, ForwardedRef, useState } from "react";
import { stylesheet } from "./design";
import Ionicons from "@expo/vector-icons/Ionicons";

// TODO: should we move all the styles here????
// TODO: should we use the stylesheet in here???

interface ButtonProps {
  label: string;
  styling: (pressed: boolean) => object,
  color?: string;
  hasIcon?: boolean;
  onPress?: () => void,
}

export const Button = forwardRef((
  { label, onPress, styling, color, hasIcon }: ButtonProps,
  ref: ForwardedRef<any>
) => {
  const c = color ?? "white";
  const inner = hasIcon === true
    ? <Ionicons name={label} color={c} size={20} />
    : <Text style={{ color: c, textAlign: "center" }}>{label}</Text>;

  return (
    <Pressable
      ref={ref}
      onPressIn={onPress}
      style={({ pressed }) => styling(pressed)}>
      {inner}
    </Pressable>
  )
});

export function RadioButtonGroup({ options, styling, selection, setSelection }) {
  const [selected, unselected] = [styling(true), styling(false)];

  return (
    <View style={{ flexDirection: "row", width: "100%", marginBottom: 25 }}>
      {options.map((option, index) =>
          <Button
            key={index}
            label={option}
            styling={(_) => index == selection ? selected : unselected}
            onPress={() => setSelection(index)}
            color={index == selection ? selected.color : unselected.color}
          />
      )}
    </View>
  )
}

interface InputProps {
  setData: (data: number) => void;
  prefix: string;
  suffix: string;
  columnWidth?: number;
}

export function AlignedInput({ setData, prefix, suffix, columnWidth }: InputProps) {
  // Only to stop typescript from complaining
  const set = (data: string) => setData((data as unknown) as number);

  return (
    <View style={[stylesheet.row, { justifyContent: "flex-start" }]}>
      <Text style={{ width: columnWidth ?? 100 }}>{prefix}</Text>
      <TextInput
        placeholder="0"
        style={stylesheet.input}
        onChange={(event) => set(event.nativeEvent.text)}
        keyboardType="numeric" />
      <Text style={[ stylesheet.dimmed, { marginLeft: 10 } ]}>{suffix}</Text>
    </View>
  )
}

export default Button;