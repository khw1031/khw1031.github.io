import { useState } from 'react'
import { createGlobalStyle } from 'styled-components'
import theme from 'styled-theming'
import { darkTheme } from './dark'
import { lightTheme } from './light'
import { resetCss } from '../reset'

const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
}

const getTheme = currentTheme =>
  currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT

export const useSiteTheme = () => {
  const [siteTheme, setTheme] = useState(
    () => localStorage.getItem('theme') || THEMES.LIGHT
  )

  const setSiteTheme = () => {
    setTheme(prevTheme => {
      const nextTheme = getTheme(prevTheme)
      localStorage.setItem('theme', nextTheme)
      return nextTheme
    })
  }

  return [siteTheme, setSiteTheme]
}

export const GlobalStyle = createGlobalStyle`
  ${theme('siteTheme', {
    light: [...resetCss, ...lightTheme],
    dark: [...resetCss, ...darkTheme],
  })}
`
