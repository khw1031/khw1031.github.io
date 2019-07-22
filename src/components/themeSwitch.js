import React from 'react'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'
import { size } from 'polished'
import moon from '../../images/icons/moon.svg'
import sun from '../../images/icons/sun.svg'
import { getTheme } from '../styles/theme'

export const ThemeSwitch = ({ theme, setSiteTheme }) => {
  return (
    <Div>
      <Bulb
        type='button'
        title={`change to ${getTheme(theme)} theme`}
        aria-labelledby='switch site theme'
        onClick={setSiteTheme}
      />
    </Div>
  )
}

ThemeSwitch.propTypes = {
  theme: PropTypes.string.isRequired,
  setSiteTheme: PropTypes.func.isRequired,
}

const Div = styled.div`
  ${size('20px')};
  margin-left: 10px;
`

const Bulb = styled.button.attrs(({ theme: { siteTheme } }) => ({
  url: siteTheme === 'dark' ? moon : sun,
}))`
  ${({ url }) => css`
    ${size('100%')}
    border: none;
    padding: 0;
    &:active {
      transform: scale(0.95);
    }
    -webkit-appearance: none;
    cursor: pointer;
    outline-width: 0;
    background: url(${url});
    background-repeat: no-repeat;
    background-position: right center;
    background-size: contain;
  `}
`
