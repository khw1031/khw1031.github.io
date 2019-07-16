import { lighten } from 'polished'
import { css } from 'styled-components'
import { commonColors, buttonColors } from './common'

export const lightTheme = css`
  body {
    background: ${commonColors.background};
    color: ${commonColors.foreground};
  }
  h1 {
    color: ${commonColors.foreground};
  }
  a {
    color: ${commonColors.linkColor};
    border-bottom: '2px solid ${lighten(0.3, commonColors.primaryColor)}';
  }
  a:hover {
    color: ${commonColors.linkHoverColor};
    background: ${buttonColors.primaryHover};
    border-bottom: '2px solid ${commonColors.primaryHover}';
  }
  a:active,
  a:focus {
    color: ${commonColors.linkHoverColor};
    background: ${buttonColors.primaryHover};
    border-bottom: '2px dashed ${commonColors.linkHoverColor}';
  }
`
