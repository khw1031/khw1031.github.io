import React from 'react'
import styled, { css } from 'styled-components'
import theme from 'styled-theming'
import { BaseContainer } from '../styles/container'
import { tabletAbove } from '../styles/mediaQuery'
import {
  LightThemeColors,
  DarkThemeColors,
} from '../../custom/styleScheme/colors'

export const Footer = () => {
  return (
    <StyledFooter>
      <Container maxWidth='800px'>
        <Menus>
          <Menu>
            <a href='https://www.github.com/khw1031'>GitHub</a>
          </Menu>
          <Menu>
            <a href='https://khw1031.github.io/rss.xml'>RSS</a>
          </Menu>
          <Menu>
            <a href='https://github.com/khw1031/khw1031.github.io'>
              View source
            </a>
          </Menu>
        </Menus>
      </Container>
    </StyledFooter>
  )
}

const StyledFooter = styled.footer`
  height: 55px;
  ${tabletAbove`
    height: 100px;
  `}
`

const Container = styled(BaseContainer)`
  height: 100%;
`

const Menus = styled.ul`
  display: flex;
  height: 100%;
  align-items: center;
  margin: 0;
`

const Menu = styled.li`
  list-style-type: none;
  font-weight: 400;
  margin: 0;
  & + & {
    margin-left: 14px;
    ${tabletAbove`
      margin-left: 18px;
    `}
  }
  a {
    cursor: pointer;
    text-decoration: none;
    font-size: 14px;
    ${tabletAbove`
      font-size: 1rem;
    `}
    :hover {
      background: transparent;
      ${theme('siteTheme', {
        light: css`
          color: ${DarkThemeColors.footerColor};
        `,
        dark: css`
          color: ${LightThemeColors.footerColor};
        `,
      })}
    }
    ${theme('siteTheme', {
      light: css`
        color: ${LightThemeColors.footerColor};
      `,
      dark: css`
        color: ${DarkThemeColors.footerColor};
      `,
    })}
  }
`
