import { Appearance } from "react-native";

export const fontSize = {
  small: 9,
  normal: 14,
  big: 24,
};

// The shades of the colors are defined from lightest to darkest
const colors = {
  light: {
    text: {
      100: "#0A0A0A",
      200: "#666666",
      300: "#b8b8b8",
    },
    background: {
      100: "#b8b8b8",
      200: "#ebebeb",
      300: "#ffffff",
    },
    primary: {
      100: "#1199CD",
      //100: "#4E9AD0",
      200: "#3E92CC",
      300: "#3386C1",
      400: "#7EB5DD",
    },
    secondary: {
      100: "#D264B6",
    },
    red: "#ed1c24",
    green: "#03C959",
  },
  dark: {
    text: {
      100: "#0A0A0A",
      200: "#666666",
      300: "#b8b8b8",
    },
    background: {
      100: "#b8b8b8",
      200: "#ebebeb",
      300: "#ffffff",
    },
    primary: {
      100: "#4E9AD0",
      200: "#3E92CC",
      300: "#3386C1",
      400: "#7EB5DD",
    },
    secondary: {
      100: "#83A9C4"
    },
    red: "#ed1c24",
    green: "#03C959",
  },
};

export const getColors = () => {
  const variant = Appearance.getColorScheme() ?? "light";
  return colors[variant]; // TODO: also implement proper dark theme
};

export default getColors;
