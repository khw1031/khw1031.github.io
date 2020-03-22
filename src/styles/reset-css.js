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
    margin: 0;
  }
  article,
  aside,
  details,
  figcaption,
  figure,
  footer,
  header,
  main,
  menu,
  nav,
  section,
  summary {
    display: block;
    margin: 0;
  }
  audio,
  canvas,
  progress,
  video {
    display: inline-block;
  }
  small {
    font-size: 80%;
  }
  ul,
  ol {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  img {
    display: block;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p {
    margin: 0;
  }
`;
