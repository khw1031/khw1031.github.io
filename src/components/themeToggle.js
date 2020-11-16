import React, { useContext } from "react";
import styled from "styled-components";
import { ThemeContext } from "../context/themeContext";

import moon from "../../static/images/moon.svg";
import sun from "../../static/images/sun.svg";
import { tabletAbove } from "../styles/mediaQuery";

const ThemeToggle = () => {
  const { colorMode, setColorMode } = useContext(ThemeContext);
  if (!colorMode) return null;

  const isDarkMode = colorMode === "dark";

  return (
    <label>
      <HiddenInput
        type="checkbox"
        checked={isDarkMode}
        onChange={ev => {
          setColorMode(ev.target.checked ? "dark" : "light");
        }}
      />{" "}
      <Icon isDarkMode={isDarkMode}></Icon>
    </label>
  );
};

const HiddenInput = styled.input`
  display: none;
`;

const Icon = styled.div`
  background: ${props =>
    props.isDarkMode ? `url(${moon})` : `url(${sun})`};
  background-repeat: no-repeat;
  background-position: right center;
  background-size: contain;
  width: 1rem;
  height: 1rem;
  cursor: pointer;
  transition: background 450ms ease 0s;
  ${tabletAbove`
    width: 1.25rem;
    height: 1.25rem;
  `}
`;

export default ThemeToggle;
