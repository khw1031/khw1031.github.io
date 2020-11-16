import React from "react";
import { ThemeProvider } from "../context/themeContext";
import GlobalStyle from "../styles/globalStyle";
import "fontsource-noto-sans-kr";
import "fontsource-noto-serif-kr";
import "fontsource-noto-sans-kr/300-normal.css"
import "fontsource-noto-sans-kr/700-normal.css"

function App({ children }) {
  return (
    <ThemeProvider>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
}

export default App;
