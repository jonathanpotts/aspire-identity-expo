import { DarkTheme, DefaultTheme, type Theme } from "@react-navigation/native";
import { formatColor } from "./utils";

export const THEME = {
  light: {
    background: "oklch(1 0 0)",
    foreground: "oklch(0.145 0 0)",
    card: "oklch(1 0 0)",
    cardForeground: "oklch(0.145 0 0)",
    popover: "oklch(1 0 0)",
    popoverForeground: "oklch(0.145 0 0)",
    primary: "oklch(0.488 0.243 264.376)",
    primaryForeground: "oklch(0.97 0.014 254.604)",
    secondary: "oklch(0.967 0.001 286.375)",
    secondaryForeground: "oklch(0.21 0.006 285.885)",
    muted: "oklch(0.97 0 0)",
    mutedForeground: "oklch(0.556 0 0)",
    accent: "oklch(0.97 0 0)",
    accentForeground: "oklch(0.205 0 0)",
    destructive: "oklch(0.577 0.245 27.325)",
    border: "oklch(0.922 0 0)",
    input: "oklch(0.922 0 0)",
    ring: "oklch(0.708 0 0)",
    radius: "0.625rem",
    chart1: "oklch(0.809 0.105 251.813)",
    chart2: "oklch(0.623 0.214 259.815)",
    chart3: "oklch(0.546 0.245 262.881)",
    chart4: "oklch(0.488 0.243 264.376)",
    chart5: "oklch(0.424 0.199 265.638)",
    sidebar: "oklch(0.985 0 0)",
    sidebarForeground: "oklch(0.145 0 0)",
    sidebarPrimary: "oklch(0.546 0.245 262.881)",
    sidebarPrimaryForeground: "oklch(0.97 0.014 254.604)",
    sidebarAccent: "oklch(0.97 0 0)",
    sidebarAccentForeground: "oklch(0.205 0 0)",
    sidebarBorder: "oklch(0.922 0 0)",
    sidebarRing: "oklch(0.708 0 0)",
  },
  dark: {
    background: "oklch(0.145 0 0)",
    foreground: "oklch(0.985 0 0)",
    card: "oklch(0.205 0 0)",
    cardForeground: "oklch(0.985 0 0)",
    popover: "oklch(0.205 0 0)",
    popoverForeground: "oklch(0.985 0 0)",
    primary: "oklch(0.424 0.199 265.638)",
    primaryForeground: "oklch(0.97 0.014 254.604)",
    secondary: "oklch(0.274 0.006 286.033)",
    secondaryForeground: "oklch(0.985 0 0)",
    muted: "oklch(0.269 0 0)",
    mutedForeground: "oklch(0.708 0 0)",
    accent: "oklch(0.269 0 0)",
    accentForeground: "oklch(0.985 0 0)",
    destructive: "oklch(0.704 0.191 22.216)",
    border: "oklch(1 0 0 / 10%)",
    input: "oklch(1 0 0 / 15%)",
    ring: "oklch(0.556 0 0)",
    radius: "0.625rem",
    chart1: "oklch(0.809 0.105 251.813)",
    chart2: "oklch(0.623 0.214 259.815)",
    chart3: "oklch(0.546 0.245 262.881)",
    chart4: "oklch(0.488 0.243 264.376)",
    chart5: "oklch(0.424 0.199 265.638)",
    sidebar: "oklch(0.205 0 0)",
    sidebarForeground: "oklch(0.985 0 0)",
    sidebarPrimary: "oklch(0.623 0.214 259.815)",
    sidebarPrimaryForeground: "oklch(0.97 0.014 254.604)",
    sidebarAccent: "oklch(0.269 0 0)",
    sidebarAccentForeground: "oklch(0.985 0 0)",
    sidebarBorder: "oklch(1 0 0 / 10%)",
    sidebarRing: "oklch(0.556 0 0)",
  },
};

export const FORMATTED_THEME: Record<
  "light" | "dark",
  Record<string, string>
> = {
  light: Object.fromEntries(
    Object.entries(THEME.light).map(([key, value]) => [
      key,
      formatColor(value),
    ]),
  ),
  dark: Object.fromEntries(
    Object.entries(THEME.dark).map(([key, value]) => [key, formatColor(value)]),
  ),
};

export const NAV_THEME: Record<"light" | "dark", Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: FORMATTED_THEME.light.background,
      border: FORMATTED_THEME.light.border,
      card: FORMATTED_THEME.light.card,
      notification: FORMATTED_THEME.light.destructive,
      primary: FORMATTED_THEME.light.primary,
      text: FORMATTED_THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: FORMATTED_THEME.dark.background,
      border: FORMATTED_THEME.dark.border,
      card: FORMATTED_THEME.dark.card,
      notification: FORMATTED_THEME.dark.destructive,
      primary: FORMATTED_THEME.dark.primary,
      text: FORMATTED_THEME.dark.foreground,
    },
  },
};
