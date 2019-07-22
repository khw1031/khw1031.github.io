import { lighten, darken } from 'polished'

/** Common Colors */
export const backgroundDefault = '#f0f0f0'
export const foregroundDefault = '#404040'
export const primaryColor = '#5183f5'
export const secondaryColor = 'ff5a55'
export const fontColor = '#333333'

/** Light Theme Colors */
export const LightThemeColors = {
  body: '#404040',
  background: '#ffffff',
  brandFont: '#333333',
  brandFontHover: darken(0.2, '#333333'),
  menu: '#969eaf',
  menuHover: darken(0.2, '#969eaf'),
  link: '#5183f5',
  linkBorder: '#e2eafd',
  linkHover: '#2161f2',
  linkHoverBg: '#f0f4fe',
  headerColor: '#111111',
  headerBorderBottom: '#ebebeb',
}

/** Dark Theme Colors */
export const DarkThemeColors = {
  body: '#b3b9c5',
  background: '#2d2d2d',
  brandFont: '#c1c6d0',
  brandFontHover: lighten(0.2, '#c1c6d0'),
  onScrollNav: '#202020',
  menu: '#969eaf',
  menuHover: lighten(0.2, '#969eaf'),
  link: '#81a5f8',
  linkBorder: '#81a5f8',
  linkHover: '#5183f5',
  headerColor: '#cecece',
  headerBorderBottom: '#252525',
}