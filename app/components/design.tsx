import { StyleSheet } from "react-native";

export const colors = {
  aquamarine: "#5DFDCB",
  blue: "#71C1FE",
  darkblue: "#5DB8FE",
  bg: "#ffffff",
  fg: "#08090a",
  grey: "#f2f2f8",
  darkgrey: "#D7D7EA",
  darkergrey: "#CACAE2"
}

// Base styles
export const stylesheet = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },

  card: {
    width: "95%",
    minHeight: 100,
    marginBottom: 10,
    borderRadius: 10,
    borderColor: colors.darkgrey,
    borderStyle: "solid",
    borderWidth: 1,
    alignSelf: "center"
  },

  softButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },

  hardButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 2,
    borderRightWidth: 1
  },

  input: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: colors.bg,
    borderColor: colors.darkgrey,
    borderStyle: "solid",
    borderWidth: 1,
    marginBottom: 10,
  },

  header: { fontSize: 24 },
  text: { textAlign: "justify" },
  dimmed: { color: "grey" },
  bold: { fontWeight: "bold", color: "black" }
});

export const activeButton = (pressed: boolean) => {
  return {
    backgroundColor: pressed ? colors.darkblue : colors.blue,
    ...stylesheet.softButton,
  };
};

export const inactiveButton = (pressed: boolean) => {
  return {
    backgroundColor: pressed ? colors.darkergrey : colors.darkgrey,
    ...stylesheet.softButton,
  };
};

export const labelButton = (selected: boolean) => {
  return {
    borderColor: selected ? "#ffffff00" : colors.blue,
    backgroundColor: selected ? colors.blue : "#ffffff00",
    ...stylesheet.hardButton,
  };
}

export default stylesheet;