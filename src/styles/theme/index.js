import { createGlobalStyle } from 'styled-components'
import theme from 'styled-theming'
import { darkTheme } from './dark'
import { lightTheme } from './light'
import { resetCss } from '../reset'

const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
}

export const getTheme = currentTheme =>
  currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT

export const GlobalStyle = createGlobalStyle`
  ${theme('siteTheme', {
    light: [...resetCss, ...lightTheme],
    dark: [...resetCss, ...darkTheme],
  })}
`
