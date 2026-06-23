import { useEffect } from "react";
import { createTheme, ThemeProvider as MuiThemeProvider, CssBaseline, StyledEngineProvider } from "@mui/material";
import { useAppSelector } from "@/store";
import { selectTheme } from "@/features/ui/uiSlice";
import { themeTokens } from "@/styles/themeTokens";

function buildMuiTheme(mode: "light" | "dark") {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: themeTokens.colors.brand[500],
        light: themeTokens.colors.brand[300],
        dark: themeTokens.colors.brand[700],
      },
      error: { main: themeTokens.colors.error },
      warning: { main: themeTokens.colors.warning },
      success: { main: themeTokens.colors.success },
      info: { main: themeTokens.colors.info },
      background: {
        default: mode === "light" ? themeTokens.colors.cream : themeTokens.dark.bg,
        paper: mode === "light" ? "#ffffff" : themeTokens.dark.surface,
      },
    },
    typography: {
      fontFamily: themeTokens.fontFamily.sans,
    },
    shape: { borderRadius: 8 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          "@layer base, mui, utilities": {},
        },
      },
    },
  });
}

interface Props {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: Props) {
  const theme = useAppSelector(selectTheme);
  const muiTheme = buildMuiTheme(theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <StyledEngineProvider injectFirst>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline enableColorScheme />
        {children}
      </MuiThemeProvider>
    </StyledEngineProvider>
  );
}
