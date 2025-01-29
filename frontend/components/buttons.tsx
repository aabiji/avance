import { forwardRef, ForwardedRef, ReactNode } from "react";
import { Pressable, StyleSheet, StyleProp, ViewStyle } from "react-native";
import getColors from "@/components/theme";

import Ionicons from "@expo/vector-icons/Ionicons";

interface ButtonProps {
  children: ReactNode,
  onPress?: () => void,
}

export const Button = forwardRef(({ onPress, children }: ButtonProps, ref: ForwardedRef<any>) => {
  return (
    <Pressable
      ref={ref}
      onPressIn={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: pressed ? getColors().primary["400"] : getColors().primary["500"],
        },
      ]}
    >
      {children}
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
  dimmed?: boolean;
  size?: number;
}

export const ClickableIcon = forwardRef(
  ({ name, onPress, transparent, style, size }: ClickableIconProps,
    ref: ForwardedRef<any>
  ) => {
    let color = transparent ? getColors().secondary["400"] : getColors().background["50"];
    const baseSize = transparent ? 35 : 25;
    const base = transparent ? "#00000000" : getColors().accent["500"];
    const hover = transparent ? `${getColors().primary["100"]}10` : getColors().accent["400"];
    return (
      <Pressable
        ref={ref}
        onPressIn={onPress}
        style={({ pressed }) => [
          styles.icon,
          { backgroundColor: pressed ? hover : base },
          style
        ]}
      >
        <Ionicons name={name} color={color} size={size ?? baseSize} />
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    alignItems: "center"
  },
  icon: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: "50%",
    justifyContent: "center",
    alignContent: "center",
  }
});
