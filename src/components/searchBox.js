import React from 'react'
import { lighten, darken } from 'polished'
import styled, { css } from 'styled-components'
import theme from 'styled-theming'
import {
  DarkThemeColors,
  LightThemeColors,
} from '../../custom/styleScheme/colors'
import { tabletAbove } from '../styles/mediaQuery'

export const SearchBox = ({ searchStr, handleSearch, filterCount }) => {
  return (
    <BoxContainer>
      <Input
        type='text'
        value={searchStr}
        placeholder='제목으로 필터링...'
        onChange={handleSearch}
      />
      <Count>{filterCount}</Count>
    </BoxContainer>
  )
}

const InputCss = theme('siteTheme', {
  light: css`
    background: #fff;
    border: 2px solid #ccc;
    color: ${LightThemeColors.body};
    :active,
    :focus {
      border: 2px solid ${LightThemeColors.link};
      background: ${LightThemeColors.filterButtonBg};
    }
    :hover:not(:focus) {
      border: 2px solid ${darken(0.1, '#ccc')};
      background: ${darken(0.02, '#fff')};
    }
  `,
  dark: css`
    background: ${DarkThemeColors.filterButtonBg};
    border: 2px solid #444;
    color: ${DarkThemeColors.body};
    :active,
    :focus {
      border: 2px solid ${LightThemeColors.link};
    }
    :hover:not(:focus) {
      border: 2px solid ${lighten(0.1, '#444')};
    }
  `,
})

const BoxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`
const Input = styled.input`
  outline-width: 0;
  border-radius: 4px;
  padding: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  width: 100%;
  ${InputCss}
  ${tabletAbove`
    padding: 0.6rem;
    font-size: 0.9rem;
  `}
`

const Count = styled.div`
  width: 80px;
  text-align: center;
  font-weight: 600;
  font-size: 1rem;
  color: ${LightThemeColors.link};
  ${tabletAbove`
    font-size: 1.3rem;
  `}
`
