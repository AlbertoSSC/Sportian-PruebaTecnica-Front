import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#c6a227",
    },
    secondary: {
      main: "#1a73e8",
      dark: "#0d47a1",
    },
    background: {
      default: "#0d1117",
      paper: "#11151b",
    },
    text: {
      primary: "#e6edf3",
      secondary: "#8b949e",
    },
    error: {
      main: "#f85149",
    },
    warning: {
      main: "#d29922",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid rgba(255,255,255,0.08)",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
          "&:hover": {
            transform: "translateY(-2px)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
    MuiTextField: {
      defaultProps: { size: "small" },
    },
  },
});
