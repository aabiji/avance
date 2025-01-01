import { ReactNode, useRef } from "react";
import {
  Animated,
  PanResponder,
  ScrollView,
  StyleSheet,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";

import getTheme from "./theme";

export function Row({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.row, style]}>{children}</View>;
}

export function Container({
  children,
  style,
  noScroll,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  noScroll?: boolean;
}) {
  return noScroll ? (
    <View style={[styles.container, style]}>{children}</View>
  ) : (
    <ScrollView contentContainerStyle={[styles.container, style]}>
      {children}
    </ScrollView>
  );
}

export function SwipeableCard({ maxXOffset, children }: { maxXOffset: number, children: ReactNode }) {
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
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.card, styles.row,
        {transform: [{translateX: pan.x}, {translateY: pan.y}
      ]}
    ]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    backgroundColor: getTheme().background,
  },
  card: {
    width: "100%",
    height: 100,
    marginBottom: 15,
    alignSelf: "center",
    backgroundColor: getTheme().backgroundShade,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 3,
  },
  container: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    backgroundColor: getTheme().background,
  },
});
