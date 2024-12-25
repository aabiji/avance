import { forwardRef, ForwardedRef } from "react";
import { Text, Pressable, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import getTheme from "@/components/theme";

export const Button = forwardRef(
  (
    { label, onPress }: { label: string; onPress?: () => void },
    ref: ForwardedRef<any>,
  ) => {
    return (
      <Pressable
        ref={ref}
        onPressIn={onPress}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: pressed
              ? getTheme().primary
              : getTheme().secondary,
          },
        ]}
      >
        <Text style={styles.text}>{label}</Text>
      </Pressable>
    );
  },
);

export const ClickableIcon = forwardRef(
  (
    { name, onPress, transparent }: { name: string; onPress?: () => void, transparent?: boolean },
    ref: ForwardedRef<any>,
  ) => {
    const color = transparent ? getTheme().accent : getTheme().background;
    return (
      <Pressable
        ref={ref}
        onPressIn={onPress}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: pressed
              ? getTheme().secondary
              : transparent ? "#ffffff00" : getTheme().accent,
          },
        ]}
      >
        <Ionicons name={name} color={color} size={20} />
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  text: {
    color: getTheme().accent,
    textAlign: "center",
  },
});
