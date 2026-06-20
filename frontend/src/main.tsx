import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import {
  ThemeProvider,
  createTheme,
} from "@mui/material/styles";

import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./context/AuthContext";

const theme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: "#0a2069", 
    },

    secondary: {
      main: "#096129", 
    },

    background: {
      default: "#030c24",
      paper: "#020d26",
    },

    success: {
      main: "#22C55E",
    },

    text: {
      primary: "#F8FAFC",
      secondary: "#b0c4df",
    },
  },
});

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);