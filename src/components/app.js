import React from "react";
import { ThemeProvider } from "../context/themeContext";
import GlobalStyle from "../styles/globalStyle";

function App({ children }) {
  return (
    <ThemeProvider>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
}

export default App;
