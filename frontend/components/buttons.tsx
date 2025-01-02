import { forwardRef, ForwardedRef } from "react";
import { Text, Pressable, StyleSheet, StyleProp, ViewStyle } from "react-native";
import getColors from "@/components/theme";

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
            backgroundColor: pressed ? getColors().primary["400"] : getColors().primary["500"],
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
  ({ name, onPress, transparent, style }: ClickableIconProps, ref: ForwardedRef<any>,
  ) => {
    const color = transparent ? getColors().primary["default"] : getColors().background["default"];
    const size = transparent ? 35 : 25;
    const base = transparent ? "#00000000" : getColors().primary["500"];
    const hover = transparent ? `${getColors().primary["400"]}10` : getColors().primary["400"];
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
        <Ionicons name={name} color={color} size={size} />
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 10
  },
  icon: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: "50%",
    justifyContent: "center",
    alignContent: "center",
  },
  text: {
    color: getColors().background["default"],
    textAlign: "center",
  },
});
