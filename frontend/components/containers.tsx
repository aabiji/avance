import { ReactNode, useRef } from "react";
import {
  Animated,
  PanResponder,
  StyleSheet,
  StyleProp,
  View,
  ViewStyle
} from "react-native";

import getColors from "./theme";

interface ContainerProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  row?: boolean;
  background?: boolean;
  avoidKeyboard?: boolean;
}

export function Container(
  { background, children, avoidKeyboard, row, style }
: ContainerProps) {
  const bg = background ? getColors().background["50"] : getColors().background["100"];
  return (
    <View
      behavior="position"
      enabled={avoidKeyboard ?? false}
      style={[
        row ? styles.row : styles.container,
        { backgroundColor: bg },
        style,
      ]}>
      {children}
    </View>
  )
}

interface SwipeableCardProps {
  maxXOffset: number;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function SwipeableCard({ maxXOffset, children, style }: SwipeableCardProps) {
  const pan = useRef(new Animated.ValueXY()).current;

  const move = (goLeft: boolean) => {
    Animated.timing(pan, {
      toValue: { x: goLeft ? maxXOffset : 0, y: 0 },
      useNativeDriver: true,
      duration: 200
    }).start();
  }

  // Handle swiping to the left
  const panResponder = useRef(PanResponder.create({
    // To make scrolling inside a FlatList work as usual
    onStartShouldSetPanResponder: () => false,

    onMoveShouldSetPanResponder: () => true,

    onPanResponderMove: (_event, gestureState) => {
      // Ignore taps
      const movementX = Math.floor(gestureState.dx);
      if (movementX >= -2 || movementX <= 0) return;
      // Move the element to the left along with the swipe
      const x = Math.min(Math.max(maxXOffset, gestureState.dx), 0);
      pan.setValue({ x: x, y: 0 });
    },

    onPanResponderRelease: (_event, gestureState) => {
      if (gestureState.dx <= -50) {
        // Stay at the offsetted x position when we've swiped left
        move(true);
      } else {
        // Move back right when we tap or swipe right
        move(false);
      }
    }
  })).current;

  return (
    <View style={[styles.card, style]}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.row,
          { transform: [{ translateX: pan.x }, { translateY: pan.y }] },
        ]}>
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  card: {
    width: "95%",
    overflow: "hidden",
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: getColors().background["100"],
  }
});
