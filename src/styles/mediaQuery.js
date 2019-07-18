import { css } from 'styled-components'
import { BreakPoints } from '../../custom/styleScheme'

/**
 * @param {string} breakpoint - breakpoint defined in styleScheme
 * @return {function} return tag function that takes css String in styled component
 */
export const mediaQuery = breakpoint => ([cssStr]) => css`
  @media (min-width: ${BreakPoints[breakpoint]}) {
    ${cssStr}
  }
`
