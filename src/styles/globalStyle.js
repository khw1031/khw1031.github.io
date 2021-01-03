import { createGlobalStyle } from "styled-components";
import { mobileLAbove, tabletAbove } from "./mediaQuery";
import ResetCss from "./resetCss";
import CodeCss from "./codeCss";

const GlobalStyle = createGlobalStyle`

:root {
  --font-weight-bold: 700;
  --font-weight-medium: 400;
  --font-weight-light: 300;
  --font-family: -apple-system, "system-ui", BlinkMacSystemFont, "Segoe UI",
      Roboto, "Helvetica Neue", "Noto Sans KR", Arial, sans-serif;
  --font-family-serif: "Noto Serif KR", serif;
  --font-size-brand: 0.875rem;
  --font-size-section-headone: 2rem;
  --font-size-section-subtitle: 1.3rem;
  --font-size-section-subtwo: 1rem;

  /* space: inset, stack, inline, squished inset, pad-side */
  --container-pad: 0 1rem;
  --container-max-width: 780px;
  --container-margin: 0 auto;

  --header-pad: 1rem 0;

  --inset-header: 0 0;

  --inline-xs: 0.8rem;
  --inline-s: 1rem;

  --squish-s: 0.5rem;

  --stack-main: 3.5rem;
  --stack-section-title: 1.5rem;

  --navbar-z-index: 2;


  /* colors */
  --border: #d6d9de;
  --yellow: #ffd43b;

  /* z-indices */
  --z-link: 32;

}

${mobileLAbove`
  :root {
    --inset-header: 0;
    --font-size-brand: 1.125rem;
    --squish-s: 1rem;

    --stack-main: 4.5rem;
    --stack-section-title: 2rem;
  }
`}

${tabletAbove`
  :root {
    --container-pad: 0 2rem;
    
    --font-size-section-headone: 3rem;
    --font-size-section-subtitle: 1.5rem;
    --font-size-section-subtwo: 1.2rem;

  }
`}


/* CSS-RESET */
${ResetCss}

/* Code CSS */
${CodeCss}


`;

export default GlobalStyle;
