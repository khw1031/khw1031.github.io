import { css } from "styled-components";
import { mobileLAbove } from "./mediaQuery";

export default css`
  margin-top: 6rem;
  ${mobileLAbove`
    margin-top: 8rem;
  `}

  h1,h2,h3,h4,h5,h6,p {
  }

  p {
    font-weight: var(--font-weight-light);
    line-height: 1.6;
    font-size: 0.95rem;
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
    font-size: 1.4rem;
    padding-bottom: 0.25rem;
    border-bottom: 1px solid var(--border);
    /* display: inline-block; */
    ${mobileLAbove`
      font-size: 1.5rem;
    `}
  }

  h2 code {
    font-size: 1.6rem !important;
  }

  h3 {
    font-size: 1rem;
    color: var(--color-font);
    font-weight: 700;
    margin-bottom: 1rem;
    padding-bottom: 0.25rem;
    border-bottom: 1px solid var(--border);
    /* display: inline-block; */
    ${mobileLAbove`
      font-size: 1.2rem;
    `}
  }

  h3 code {
    font-size: 1.4rem !important;
  }

  h4 {
    font-size: 1rem;
    color: var(--color-font);
    margin-bottom: 1rem;
    padding-bottom: 0.25rem;
    ${mobileLAbove`
      font-size: 1.1rem;
    `}
  }

  /* List */

  ul,
  ol {
    margin: 1.5rem 0;
    font-size: 0.95rem;
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

  ol {
    list-style-type: decimal;
    margin-left: 1.1rem;
    font-size: 0.95rem;
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

  p {
    line-height: 1.8;
  }
  p + p {
    margin-top: 1rem;
  }
  .gatsby-highlight {
    margin-top: 2rem;
  }

  .reference__md {
    margin: 8rem 0 1rem 0;
    font-size: 0.8rem;
    text-align: center;
    text-align: end;
  }

  a {
    color: var(--color-secondary);
    text-decoration: underline;
    svg {
      width: 12px;
      height: 12px;
    }
    svg path {
      fill: var(--color-gray700);
    }
  }

  .gatsby-resp-image-background-image {
    display: block;
    margin: 2rem 0;
  }
`;
