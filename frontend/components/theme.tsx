import { Appearance } from "react-native";

export const fontSize = {
  100: 9, 200: 10, 300: 12,
  400: 13, 500: 14, 600: 16,
  700: 20, 800: 24
};

const colors = {
  light: {
    red: "#F34A44",
    green: "#16DB93",
    text: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#e5e5e5",
      300: "#d4d4d4",
      400: "#a3a3a3",
      500: "#737373",
      600: "#525252",
      700: "#404040",
      800: "#262626",
      900: "#171717",
      950: "#0a0a0a",
    },
    background: {
      50: "#ffffff",
      100: "#f9f9f9",
      200: "#dfdfdf",
    },
    primary: {
      50: "#eaf4fa",
      100: "#d6e9f5",
      200: "#acd3ec",
      300: "#83bee2",
      400: "#5aa8d8",
      500: "#3092cf",
      600: "#2775a5",
      700: "#1d587c",
      800: "#133a53",
      900: "#0a1d29",
      950: "#050f15",
    },
    secondary: {
      50: "#faeaef",
      100: "#f5d6e0",
      200: "#ebadc1",
      300: "#e184a1",
      400: "#d75b82",
      500: "#cd3263",
      600: "#a4284f",
      700: "#7b1e3b",
      800: "#521428",
      900: "#290a14",
      950: "#15050a",
    },
    accent: {
      50: "#86badf",
      100: "#5ea3d4",
      200: "#368cc9",
      300: "#2b70a1",
    }
  },
  dark: {
    red: "#e35954",
    green: "#2cc38c",
    text: {
      50: "#0a0a0a",
      100: "#171717",
      200: "#262626",
      300: "#404040",
      400: "#737373",
      500: "#a3a3a3",
      600: "#d4d4d4",
      700: "#e5e5e5",
      800: "#f5f5f5",
      900: "#fafafa",
      950: "#ffffff",
    },
    background: {
      50: "#212121",
      100: "#303030",
      200: "#414141",
    },
    primary: {
      50: "#050f15",
      100: "#0a1d29",
      200: "#133a53",
      300: "#1d587c",
      400: "#2775a5",
      500: "#3092cf",
      600: "#5aa8d8",
      700: "#83bee2",
      800: "#acd3ec",
      900: "#d6e9f5",
      950: "#eaf4fa",
    },
    secondary: {
      50: "#15050a",
      100: "#290a14",
      200: "#521428",
      300: "#7b1e3b",
      400: "#a4284f",
      500: "#cd3263",
      600: "#d75b82",
      700: "#e184a1",
      800: "#ebadc1",
      900: "#f5d6e0",
      950: "#faeaef",
    },
    accent: {
      50: "#205479",
      100: "#2b70a1",
      200: "#368cc9",
      300: "#5ea3d4",
    }
  }
};

export const getColors = () => {
  const variant = Appearance.getColorScheme() ?? "light";
  return colors[variant];
};

export default getColors;
