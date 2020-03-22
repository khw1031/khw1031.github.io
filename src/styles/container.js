import styled, { css } from "styled-components";
import {
  LightThemeColors,
  DarkThemeColors,
} from "../../custom/styleScheme/colors";
import { tabletAbove } from "./mediaQuery";

export const BaseContainer = styled.div`
  ${props => css`
    max-width: ${props.maxWidth || "800px"};
    margin: auto;
    padding: 0 1.5rem;
  `}
`;

export const MarkdownContainer = styled.div.attrs(props => ({
  theme: props.theme.siteTheme,
}))`
  ${({ theme }) => css`
    h2,
    h3 {
      color: ${theme === "light"
        ? LightThemeColors.headerColor
        : DarkThemeColors.headerColor};
      font-weight: 700;
      margin: 0 0 1rem;
      ${tabletAbove`
      margin: 0 0 1.5rem;
    `}
    }

    h2 {
      padding-bottom: 0.5rem;
      font-size: 1.3rem;
      line-height: 1.3;
      border-bottom: 2px solid
        ${theme === "light"
          ? LightThemeColors.headerBorderBottom
          : DarkThemeColors.headerBorderBottom};
      ${tabletAbove`
      font-size: 1.5rem;
    `}
      &:not(:first-child) {
        margin-top: 3rem;
        ${tabletAbove`
        margin-top: 3.5rem;
      `}
      }
    }
    h3 {
      margin: 0 0 1rem;
      font-size: 1.15rem;
      &:not(:first-child) {
        margin-top: 3rem;
      }
      ${tabletAbove`
      margin: 0 0 1.5rem;
      font-size: 1.25rem;
    `}
    }

    h4 {
      margin: 0 0 1rem;
      font-size: 1.05rem;
      font-weight: 600;
      &:not(:first-child) {
        margin-top: 1rem;
      }
      ${tabletAbove`
      margin: 0 0 1.5rem;
      font-size: 1.15rem;
    `}
    }

    a.anchor {
      border-bottom: none;
      &:hover,
      &:focus,
      &:active {
        background: none;
        border-bottom: none;
      }
    }

    a {
      color: ${theme === "light"
        ? LightThemeColors.link
        : DarkThemeColors.link};
      ${theme === "light"
        ? css`
            border-bottom: 2px solid ${LightThemeColors.linkBorder};
          `
        : css`
            border-bottom: none;
          `}
      font-weight: 600;
      text-decoration-line: none;
      &:hover,
      &:focus,
      &:active {
        color: ${theme === "light"
          ? LightThemeColors.linkHover
          : DarkThemeColors.linkHover};
        background: ${theme === "light" ? LightThemeColors.linkHoverBg : ""};
        border-bottom: 2px solid
          ${theme === "light"
            ? LightThemeColors.linkHover
            : DarkThemeColors.linkBorder};
      }
      &:active {
        border-bottom: 2px dashed
          ${theme === "light"
            ? LightThemeColors.linkHover
            : DarkThemeColors.linkBorder};
      }
    }

    p {
      line-height: 1.5;
      font-size: 1rem;
      word-break: keep-all;
      word-wrap: break-word;
      ${tabletAbove`
      font-size: 1.125rem;
      line-height: 1.5;
    `}
    }

    ul,
    ol {
      margin: 0 0 2rem;
      li:before {
        content: "\\2022";
        position: absolute;
        left: 0;
        color: #8d8d8d;
        font-size: 22px;
        line-height: 1.1;
      }
      li {
        padding-left: 1.5rem;
        position: relative;
        list-style-type: none;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
        ${tabletAbove`
        font-size: 1rem;
      `}
      }
      li.task-list-item {
        list-style-type: none;
        padding-left: 0;
        height: 23px;
        :before {
          content: none;
        }
        a {
          height: 100%;
        }
        ${tabletAbove`
        height: 25px;
      `}
        input[type='checkbox'] {
          margin-right: 10px;
          ${tabletAbove`
          margin-right: 10px;
        `}
        }
      }
    }
  `}
`;
