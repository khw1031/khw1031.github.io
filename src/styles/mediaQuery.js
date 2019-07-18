import { css } from 'styled-components'
import { BreakPoints } from '../../custom/styleScheme'

export const mediaQuery = screen => ([cssStr]) => css`
  @media (min-width: ${BreakPoints[screen]}) {
    ${cssStr}
  }
`
