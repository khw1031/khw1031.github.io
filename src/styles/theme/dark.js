import { darken, lighten } from 'polished'
import { css } from 'styled-components'
import { commonColors } from './common'
import { DarkThemeColors } from '../../../custom/styleScheme/colors'

// Colors
const background = '#2d2d2d'
const foreground = '#b3b9c5'
const darkBorder = darken(0.03, background)

export const darkPalette = {
  background,
  foreground,
  darkBorder,
}

// Css
export const darkTheme = css`
  body {
    background-color: ${DarkThemeColors.background};
    color: ${foreground};
    transition: background 0.3s ease;
  }
  h1 {
    color: ${foreground};
  }
  a {
    color: ${lighten(0.1, commonColors.primaryColor)};
  }
  a:hover,
  a:active,
  a:focus {
    color: ${lighten(0.12, commonColors.primaryColor)};
    background: transparent;
  }

  ::selection {
    background: ${DarkThemeColors.link};
    color: #ffffff;
  }
`
