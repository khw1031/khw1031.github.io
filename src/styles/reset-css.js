import { css } from "@emotion/core";

export const resetCss = css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    font-variant: normal;
  }

  html {
    /* default: 16px */
    font-size: 100%;
    font-family: -apple-system, "system-ui", BlinkMacSystemFont, "Segoe UI",
      Roboto, "Helvetica Neue", Arial, sans-serif;
  }
  body {
  }
`;
