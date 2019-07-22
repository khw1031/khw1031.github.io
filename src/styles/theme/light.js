// import { lighten } from 'polished'
import { css } from 'styled-components'
import { commonColors, buttonColors } from './common'
import { LightThemeColors } from '../../../custom/styleScheme/colors'

export const lightTheme = css`
  body {
    background: ${LightThemeColors.background};
    color: ${LightThemeColors.body};
    transition: background 0.3s ease;
  }
  h1 {
    color: ${LightThemeColors.body};
  }
  a {
    color: ${LightThemeColors.link};
  }
  a:hover {
    color: ${commonColors.linkHoverColor};
    background: ${buttonColors.primaryHover};
  }
  a:active,
  a:focus {
    color: ${commonColors.linkHoverColor};
    background: ${buttonColors.primaryHover};
  }

  ::selection {
    background: rgba(255, 245, 20, 0.8);
    color: #111;
  }
`
