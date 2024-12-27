import { ScrollView, StyleSheet, View } from "react-native";
import getTheme from "./theme";

export function Row({ children, style }) {
  return <View style={[styles.row, style]}>{children}</View>;
}

export function Card({ children }) {
  return <View style={[styles.row, styles.card]}>{children}</View>;
}

export function Container({ children, style, noScroll }) {
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
    marginBottom: 20,
    borderRadius: 10,
    alignSelf: "center",
    backgroundColor: getTheme().backgroundShade,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.17,
    shadowRadius: 2.54,
    elevation: 2,
  },
  container: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    backgroundColor: getTheme().background,
  },
});
