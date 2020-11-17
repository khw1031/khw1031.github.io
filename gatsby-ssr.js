import React from "react";
import { minify } from "terser";

import {
  COLOR_MODE_KEY,
  COLORS,
  INITIAL_COLOR_MODE_CSS_PROP,
} from "./src/styles/scheme";

import App from "./src/components/app";

const MagicScriptTag = () => {
  let fnCode = `(function() {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const preferDarkFromMQ = mql.matches;
    const persistedPreference = localStorage.getItem("${COLOR_MODE_KEY}");
    const root = document.documentElement;
    let colorMode = "light"


    const hasUsedToggle = typeof persistedPreference === "string";

    colorMode = hasUsedToggle
      ? persistedPreference
      : preferDarkFromMQ
        ? "dark"
        : "light";
    
    root.style.setProperty("${INITIAL_COLOR_MODE_CSS_PROP}", colorMode);

    Object.entries(${JSON.stringify(
      COLORS
    )}).forEach(([name, colorByTheme]) => {
      const cssVarName = "--color-" + name
      root.style.setProperty(cssVarName, colorByTheme[colorMode])
    })

  })()`;

  const __html = minify(fnCode).code;
  return <script dangerouslySetInnerHTML={{ __html }} />;
};

const FallbackStyles = () => {
  const cssVariableString = Object.entries(COLORS).reduce(
    (acc, [name, colorByTheme]) => {
      return `${acc}\n--color-${name}: ${colorByTheme.light};`;
    },
    ""
  );

  const wrappedInSelector = `html { ${cssVariableString} }`;

  return (
    <>
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;700&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR&display=swap"
        rel="stylesheet"
      />
      <style>{wrappedInSelector}</style>
    </>
  );
};

export const onRenderBody = ({ setPreBodyComponents, setHeadComponents }) => {
  setHeadComponents(<FallbackStyles key={`theme__fallback-styles`} />);
  setPreBodyComponents(<MagicScriptTag key={`theme__scripts`} />);
};

export const wrapPageElement = ({ element }) => {
  return <App>{element}</App>;
};
