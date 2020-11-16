import { css } from "styled-components";

export default css`
  :root {
    --hello: 1px;
  }
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  *:focus {
    outline-color: var(--color-secondary);
    outline-width: 1px;
  }

  html {
    font-size: 100%;
    font-family: var(--font-family);
  }

  body {
    margin: 0;
    padding: 0;
    background: var(--color-background);
    color: var(--color-font);
    transition: color 350ms ease 0s, background 350ms ease 0s;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: var(--font-weight-bold);
    color: var(--color-heading);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin: 0 0 1.5rem;
  }

  h1 {
    line-height: 1.1;
  }

  p {
    margin: 0;
  }

  a {
    color: var(--color-font);
    text-decoration: none;
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

  input[type="search"] {
    -webkit-appearance: none;
  }
`;
