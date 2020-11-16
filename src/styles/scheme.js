export const COLORS = {
  font: {
    light: "#495057",
    dark: "#e9ecef",
  },
  heading: {
    light: "#212529",
    dark: "#ffffff",
  },
  background: {
    light: "#ffffff", // white
    dark: "#2b2b2b",
  },
  primary: {
    light: "#0ca678",
    dark: "#ffe066",
  },
  secondary: {
    light: "hsl(250deg, 100%, 50%)", // Purplish-blue
    dark: "hsl(190deg, 100%, 40%)", // Cyan
  },
  // Grays, scaling from least-noticeable to most-noticeable
  gray300: {
    light: "hsl(0deg, 0%, 70%)",
    dark: "hsl(0deg, 0%, 30%)",
  },
  gray500: {
    light: "hsl(0deg, 0%, 50%)",
    dark: "hsl(0deg, 0%, 50%)",
  },
  gray700: {
    light: "hsl(0deg, 0%, 30%)",
    dark: "hsl(0deg, 0%, 70%)",
  },
  navbar: {
    light: "hsl(0deg, 0%, 100%)",
    dark: "#1d1d1d",
  },
  navbarshadow: {
    light: "0 3px 13px rgba(100,110,140,.1), 0 2px 4px rgba(100,110,140,.15)",
    dark: "none",
  },
  menuActive: {
    light: "#e9ecef",
    dark: "rgba(0,0,0,0.2)"
  },
  subHeading: {
    light: "#212529",
    dark: "#ffd43b"
  },
  inversedFont: {
    light: "#e9ecef",
    dark: "#495057",
  }
};

export const SIZES = {};

export const BREAK_POINTS = {
  mobileS: "320px",
  mobileM: "375px",
  mobileL: "425px",
  tablet: "768px",
  laptop: "1024px",
  laptopL: "1440px",
  fourK: "2560px",
};

export const COLOR_MODE_KEY = "color-mode";
export const INITIAL_COLOR_MODE_CSS_PROP = "--initial-color-mode";
