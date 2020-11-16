import { css } from "styled-components";
import { BREAK_POINTS } from "./scheme";

const reduceCssStr = (cssStrs, keys) => {
  return cssStrs
    .reduce(
      (prevTags, cssAttr, i) =>
        keys[i] ? [...prevTags, cssAttr, keys[i]] : [...prevTags, cssAttr],
      []
    )
    .join("");
};

const mediaQuery = breakpoint => (cssStrs, keys) => css`
  @media (min-width: ${BREAK_POINTS[breakpoint]}) {
    ${reduceCssStr(cssStrs, keys)}
  }
`;

export const mobileSAbove = (cssStrs, ...keys) =>
  mediaQuery("mobileS")(cssStrs, keys);
export const mobileMAbove = (cssStrs, ...keys) =>
  mediaQuery("mobileM")(cssStrs, keys);
export const mobileLAbove = (cssStrs, ...keys) =>
  mediaQuery("mobileL")(cssStrs, keys);
export const tabletAbove = (cssStrs, ...keys) =>
  mediaQuery("tablet")(cssStrs, keys);
export const laptopAbove = (cssStrs, ...keys) =>
  mediaQuery("laptop")(cssStrs, keys);
export const laptopLAbove = (cssStrs, ...keys) =>
  mediaQuery("laptopL")(cssStrs, keys);
export const fourKAbove = (cssStrs, ...keys) =>
  mediaQuery("fourK")(cssStrs, keys);
