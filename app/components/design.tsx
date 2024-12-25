import { StyleSheet } from "react-native";

// What if we had a card component, a row component, different button components
// and the like, then we just passed in elements as props??

// TODO: actually categorize these colors
export const colors = {
  aquamarine: "#5DFDCB",
  blue: "#71C1FE",
  darkblue: "#5DB8FE",
  bg: "#ffffff",
  fg: "#08090a",
  grey: "#f2f2f8",
  darkgrey: "#D7D7EA",
  darkergrey: "#CACAE2",
  darkestgrey: "#a0a0b8",
  transparent: "#ffffff00",
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
    alignSelf: "center",
    backgroundColor: colors.bg,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity:  0.17,
    shadowRadius: 2.54,
    elevation: 2
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
    borderRightWidth: 1,
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

  hr: {
    height: 8,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 5
  },

  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.fg
  },

  graph: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },

  text: { textAlign: "justify" },
  dimmed: { color: colors.darkgrey },
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
    borderColor: selected ? colors.transparent : colors.blue,
    backgroundColor: selected ? colors.blue : colors.transparent,
    color: selected ? colors.bg: colors.blue,
    flex: 1, // Fill remaining horizantal space
    ...stylesheet.hardButton,
  };
}

export const transparentButton = (pressed: boolean) => {
  return {
    backgroundColor: pressed ? colors.grey : colors.transparent,
    ...stylesheet.softButton,
  };
};

export default stylesheet;