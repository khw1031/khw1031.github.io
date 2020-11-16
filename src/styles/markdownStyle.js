import { css } from "styled-components";
import { mobileLAbove } from "./mediaQuery";

export default css`
  margin-top: 6rem;
  ${mobileLAbove`
    margin-top: 8rem;
  `}

  h1,h2,h3,h4,h5,h6,p {
    word-break: keep-all;
  }

  p {
    font-weight: var(--font-weight-light);
    line-height: 1.6;
  }

  /* Heading */

  h1,
  h2,
  h3,
  h4,
  h5 {
    margin: 0 0 1.5rem 0;
    line-height: 1.2;
    color: var(--color-heading);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1:not(:first-child),
  h2:not(:first-child),
  h3:not(:first-child),
  h4:not(:first-child) {
    margin-top: 3rem;
  }

  h1 {
    font-size: 1.8rem;
    line-height: 1.1;
    ${mobileLAbove`
      font-size: 2rem;
    `}
  }

  h2 {
    font-size: 1.6rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border);
    ${mobileLAbove`
      font-size: 1.7rem;
    `}
  }

  h2 code {
    font-size: 1.6rem !important;
  }

  h3 {
    font-size: 1.4rem;
    color: var(--color-font);
    font-weight: 700;
    margin-bottom: 1rem;
    padding-bottom: 0.35rem;
    border-bottom: 1px solid var(--border);
    ${mobileLAbove`
      font-size: 1.5rem;
    `}
  }

  h3 code {
    font-size: 1.4rem !important;
  }

  h4 {
    font-size: 1.25rem;
    color: var(--color-font);
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--border);
    padding-bottom: 0.25rem;
    ${mobileLAbove`
      font-size: 1.35rem;
    `}
  }

  /* List */

  ul {
    margin-top: 1.5rem;
    ${mobileLAbove`
      margin-top: 2rem;
    `}
  }
  ul li p {
    margin: 0;
  }

  ul li ul {
    padding-left: 1rem;
    margin: 0;
  }

  ul li ul li {
    margin: 0;
  }

  ol li ol {
    margin-bottom: 0;
  }

  li + li {
    margin-top: 0.85rem;
    ${mobileLAbove`
      margin-top: 0.9rem;
    `}
  }

  /* Tables */
  table {
    display: table;
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
    border-radius: 0.35rem;
    margin-top: 1.5rem;
    border: 1px solid var(--border);
    ${mobileLAbove`
      margin-top: 2rem;
    `}
  }

  thead,
  tbody {
    white-space: nowrap;
    width: 100%;
  }

  th {
    border-bottom: 2px solid var(--border);
  }

  tfoot th {
    border-top: 1px solid var(--border);
  }

  td {
    border-bottom: 1px solid var(--border);
  }

  th,
  td {
    text-align: center;
    padding: 0.75rem !important;
    hyphens: auto;
    word-break: break-word;
  }

  tbody tr:nth-child(even) {
    background-color: var(--light-background);
  }
`;
