import { Appearance } from "react-native";

export const fontSize = {
  small: 9,
  normal: 14,
  big: 24,
};

const theme = {
  light: {
    text: "#050707",
    textShade: "#a5c0c0",
    background: "#f8fafb",
    backgroundShade: "#eff3f6",
    tabBar: "#ffffff",
    primary: "#54a7b3",
    secondary: "#9bd6df",
    accent: "#5fcbdb",
  },
  dark: {
    text: "#f9fbfb",
    textShade: "#3d5c5c",
    background: "#040606",
    backgroundShade: "#141f1f",
    tabBar: "#141f1f",
    primary: "#4c9da9",
    secondary: "#205c65",
    accent: "#248e9e",
  },
};

export const getTheme = () => {
  const variant = Appearance.getColorScheme() ?? "light";
  return theme[variant];
};

export default getTheme;
