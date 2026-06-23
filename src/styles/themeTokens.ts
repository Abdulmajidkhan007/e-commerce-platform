/* Tailwind @theme va MUI theme uchun umumiy tokenlar */
export const themeTokens = {
  colors: {
    brand: {
      50: "#fff7ed",
      100: "#ffedd5",
      200: "#fed7aa",
      300: "#fdba74",
      400: "#fb923c",
      500: "#f97316",
      600: "#ea580c",
      700: "#c2410c",
      800: "#9a3412",
      900: "#7c2d12",
    },
    cream: "#fdf6ec",
    creamDark: "#f5e6d3",
    ink: "#2b2622",
    inkLight: "#6b5a50",
    success: "#16a34a",
    warning: "#ca8a04",
    error: "#dc2626",
    info: "#2563eb",
  },
  dark: {
    bg: "#1a1410",
    surface: "#2a1f18",
    surface2: "#3a2a20",
    text: "#f5e6d3",
    textMuted: "#c4a882",
  },
  fontFamily: {
    sans: '"Inter", system-ui, -apple-system, sans-serif',
  },
  borderRadius: {
    card: "1rem",
    btn: "0.5rem",
    full: "9999px",
  },
} as const;
