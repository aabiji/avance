import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  text: { textAlign: "justify" },
  header: { fontSize: 24 },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 100,
    paddingHorizontal: 10
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  list: {
    paddingBottom: 50, // Avoid item clipping
  }
});

export default styles;