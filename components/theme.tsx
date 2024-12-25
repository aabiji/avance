import { Appearance } from "react-native";

// Generated using this: https://www.realtimecolors.com
export const theme = {
  light: {
    text: "#050714",
    background: "#f3f5fc",
    primary: "#435dd0",
    secondary: "#e189a7",
    accent: "#d97f6d",
  },
  dark: {
    text: "#ebedfa",
    background: "#03050c",
    primary: "#2f49bc",
    secondary: "#761e3b",
    accent: "#923826",
  },
};

const getTheme = () => {
  const variant = Appearance.getColorScheme() ?? "light";
  return theme[variant];
};

export default getTheme;
