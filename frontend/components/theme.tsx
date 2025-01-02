import { Appearance } from "react-native";

export const fontSize = {
  small: 9,
  normal: 14,
  big: 24,
};

const colors = {
  text: {
    default: "#04080f",
    100: "#010203",
    200: "#020306",
    300: "#03050a",
    400: "#03070d",
    500: "#04080f",
    600: "#19325d",
    700: "#2d5bab",
    800: "#648ed6",
    900: "#b2c6ea"
  },
  background: {
    default: "#ffffff",
    100: "#a3a3a3",
    200: "#adadad",
    300: "#b8b8b8",
    400: "#c2c2c2",
    500: "#cccccc",
    600: "#d6d6d6",
    700: "#e0e0e0",
    800: "#ebebeb",
    900: "#f5f5f5"
  },
  green: {
    default: "#04f06a",
    100: "#013015",
    200: "#01602b",
    300: "#029140",
    400: "#03c155",
    500: "#04f06a",
    600: "#2efc87",
    700: "#62fda5",
    800: "#97fdc3",
    900: "#cbfee1"
  },
  primary: {
    default: "#2b42f3",
    100: "#030936",
    200: "#06126c",
    300: "#091ba2",
    400: "#0d24d8",
    500: "#2b42f3",
    600: "#5568f5",
    700: "#808ef8",
    800: "#aab3fa",
    900: "#d5d9fd"
  },
  red: {
    default: "#ed1c24",
    100: "#310405",
    200: "#62080b",
    300: "#930c10",
    400: "#c41016",
    500: "#ed1c24",
    600: "#f04a4f",
    700: "#f4777b",
    800: "#f8a4a7",
    900: "#fbd2d3"
  }
};

export const getColors = () => {
  const _variant = Appearance.getColorScheme() ?? "light";
  return colors; // TODO: also support dark theme
};

export default getColors;
