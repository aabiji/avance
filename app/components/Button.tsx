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
      onPress={onPress}>
      <Text style={{ color: "white" }}>{text}</Text>
    </Pressable>
  );
});