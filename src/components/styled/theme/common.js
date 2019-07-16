import { darken, lighten } from 'polished'

const background = '#f0f0f0'
const foreground = '#404040'
const primaryColor = '#5183f5'
const secondaryColor = 'ff5a55'
const green = '#12c47c'
const yellow = '#fed356'
const accentColor = '#cdcdcd'
const alternateBackground = '#f0f0f0'
const alternateColor = '#404040'
const linkColor = primaryColor
const linkHoverColor = darken(0.1, linkColor)
const highlight = '#ffeea8'
const error = '#d33c40'

export const commonColors = {
  background,
  foreground,
  primaryColor,
  secondaryColor,
  green,
  yellow,
  accentColor,
  alternateBackground,
  alternateColor,
  linkColor,
  linkHoverColor,
  highlight,
  error,
}

// Colors for Buttons, Links, Pressable Elements
export const buttonColors = {
  primaryHover: lighten(0.33, primaryColor),
}

export const bqBorder = `16px solid ${background}`
