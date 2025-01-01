import { forwardRef, ForwardedRef } from "react";
import { Text, Pressable, StyleSheet, StyleProp, ViewStyle } from "react-native";
import getTheme from "@/components/theme";

import Ionicons from "@expo/vector-icons/Ionicons";

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
            backgroundColor: pressed ? getTheme().secondary : getTheme().primary,
          },
        ]}
      >
        <Text style={styles.text}>{label}</Text>
      </Pressable>
    );
  },
);

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];
interface ClickableIconProps {
  name: IoniconsName,
  onPress?: () => void,
  transparent?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const ClickableIcon = forwardRef(
  ( {name, onPress, transparent, style}: ClickableIconProps, ref: ForwardedRef<any>,
) => {
    const color = transparent ? getTheme().accent : getTheme().background;
    const size = transparent ? 35 : 20;
    return (
      <Pressable
        ref={ref}
        onPressIn={onPress}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: pressed
              ? getTheme().secondary
              : transparent
                ? "#ffffff00"
                : getTheme().primary,
          },
          style
        ]}
      >
        <Ionicons name={name} color={color} size={size} />
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  text: {
    color: getTheme().background,
    textAlign: "center",
  },
});
