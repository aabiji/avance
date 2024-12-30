import { ReactNode } from "react";
import {
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

export function Card({ children }: { children: ReactNode }) {
  return <View style={[styles.row, styles.card]}>{children}</View>;
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

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    backgroundColor: getTheme().background,
  },
  card: {
    width: "95%",
    minHeight: 100,
    marginBottom: 15,
    alignSelf: "center",
    paddingHorizontal: "5%",
    backgroundColor: getTheme().backgroundShade,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 1,
  },
  container: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    backgroundColor: getTheme().background,
  },
});
