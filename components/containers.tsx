import { ScrollView, StyleSheet, View } from "react-native";
import getTheme from "./theme";

export function Row({ children }) {
  return <View style={styles.row}>{children}</View>;
}

export function Card({ children }) {
  return <View style={[styles.row, styles.card]}>{children}</View>;
}

export function Container({ children, noScroll }) {
  return noScroll
    ? <View style={styles.container}>{children}</View>
    : <ScrollView contentContainerStyle={styles.container}>{children}</ScrollView>;
}

const styles = StyleSheet.create({
  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    backgroundColor: getTheme().background,
  },
  card: {
    width: "95%",
    minHeight: 100,
    marginBottom: 10,
    borderRadius: 10,
    borderColor: getTheme().accent,
    borderStyle: "solid",
    borderWidth: 1,
    alignSelf: "center",
    backgroundColor: getTheme().background,
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
