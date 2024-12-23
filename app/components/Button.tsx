import { Text, Pressable } from "react-native";
import { forwardRef, ForwardedRef } from "react";

type ButtonProps = {
  text: string;
  onPress?: () => void;
};

export default forwardRef(function Button(
  { text, onPress }: ButtonProps,
  ref: ForwardedRef<any>
) {
  // We're using onPressIn because of an android bug discussed here:
  // https://github.com/react-navigation/react-navigation/issues/7052
  return (
    <Pressable
      ref={ref}
      style={({ pressed }) => [
        { backgroundColor: pressed ? "#003459" : "#00a7e1" },
        {
          borderRadius: 10,
          paddingHorizontal: 15,
          paddingVertical: 8,
        }
      ]}
      onPressIn={onPress}>
      <Text style={{ color: "white" }}>{text}</Text>
    </Pressable>
  )
});