import { createGlobalStyle } from "styled-components";
import theme from "styled-theming";
import { darkTheme } from "./dark";
import { lightTheme } from "./light";

const THEMES = {
  DARK: "dark",
  LIGHT: "light",
};

export const getTheme = currentTheme =>
  currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;

export const GlobalStyle = createGlobalStyle`
  ${theme("siteTheme", {
    light: [...lightTheme],
    dark: [...darkTheme],
  })}
`;
