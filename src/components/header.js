import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'gatsby'
import styled, { css } from 'styled-components'
import terminal from '../../images/logo/terminal.svg'
import terminalDark from '../../images/logo/terminal_dark.svg'
import { mobileLAbove, tabletAbove } from '../styles/mediaQuery'
import { ThemeSwitch } from './themeSwitch'
import { BaseContainer } from '../styles/container'
import {
  DarkThemeColors,
  LightThemeColors,
} from '../../custom/styleScheme/colors'
import ThemeContext from '../themeContext'

const menuLinks = [
  { name: 'Me', to: '/me' },
  { name: 'Articles', to: '/articles' },
  { name: 'Contact', to: '/contact' },
]

export const Header = () => {
  const [isScrolled, setScrolled] = useState(false)
  const handleScrollY = () => {
    if (isScrolled !== window.scrollY > 20) {
      setScrolled(() => window.scrollY > 20)
    }
  }

  const { dark, toggleDark } = useContext(ThemeContext)

  useEffect(() => {
    window.addEventListener('scroll', handleScrollY)
    return () => {
      window.removeEventListener('scroll', handleScrollY)
    }
  }, [isScrolled])

  return (
    <Nav isScrolled={isScrolled}>
      <Container maxWidth='800px' isScrolled={isScrolled}>
        <TextLink to='/'>
          <Logo />
          <h1>Hyunwoo Kim</h1>
        </TextLink>
        <Links>
          {menuLinks.map(link => (
            <Menu key={link.name} to={link.to} activeClassName='active'>
              {link.name}
            </Menu>
          ))}
        </Links>
        <ThemeSwitch
          theme={dark ? 'dark' : 'light'}
          setSiteTheme={toggleDark}
        />
      </Container>
    </Nav>
  )
}

const getNavBgColor = (siteTheme, isScrolled) => {
  if (siteTheme === 'light') return LightThemeColors.background
  return isScrolled ? DarkThemeColors.onScrollNav : DarkThemeColors.background
}

const Nav = styled.nav.attrs(({ theme: { siteTheme }, isScrolled }) => ({
  boxShadow: isScrolled ? '1px 2px 18px rgba(0, 0, 0, 0.1)' : '',
  background: getNavBgColor(siteTheme, isScrolled),
}))`
  ${({ boxShadow, background }) => css`
    background: ${background};
    box-shadow: ${boxShadow};
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 3;
    /* transition: all 0.3s ease; */
  `}
`

const Container = styled(BaseContainer)`
  ${props => css`
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: height 0.3s ease;
  ${mobileLAbove`
    height: ${props.isScrolled ? '60px' : '90px'};
  `}
}`}
`

const TextLink = styled(Link)`
  ${props => css`
    display: flex;
    align-items: center;
    color: ${props.theme.siteTheme === 'light'
      ? LightThemeColors.brandFont
      : DarkThemeColors.brandFont};
    text-decoration: none;
    margin-right: 0;
    font-weight: 600;
    font-size: 1.1rem;
    background: none;
    h1 {
      display: none;
      ${tabletAbove`
        display: inline-block;
      `}
      font-size: 1rem;
      color: ${props.theme.siteTheme === 'light'
        ? LightThemeColors.brandFont
        : DarkThemeColors.brandFont};
    }
    &:hover,
    &:focus {
      background: none;
      h1 {
        color: ${props.theme.siteTheme === 'light'
          ? LightThemeColors.brandFontHover
          : DarkThemeColors.brandFontHover};
      }
    }
  `}
`

const Logo = styled.div.attrs(props => ({
  url: props.theme.siteTheme === 'dark' ? terminalDark : terminal,
}))`
  ${({ url }) => css`
    height: 18px;
    width: 25px;
    margin-right: 5px;
    background: url(${url});
    background-repeat: no-repeat;
    background-position: left center;
    background-size: contain;
  `}
`

const Links = styled.div`
  display: flex;
  justify-content: flex-end;
  flex: 1;
  margin: 0;
`

const Menu = styled(Link)`
  ${props => css`
    display: flex;
    align-items: center;
    font-size: 0.85rem;
    text-decoration: none;
    font-weight: 700;
    padding: 1rem 0.75rem;
    margin: 0;
    color: rgba(0, 0, 0, 0.45);
    line-height: 1.2;
    text-align: center;
    color: ${props.theme.siteTheme === 'dark'
      ? DarkThemeColors.menu
      : LightThemeColors.menu};
    &:hover,
    &:focus,
    &:active {
      color: ${props.theme.siteTheme === 'dark'
        ? DarkThemeColors.menuHover
        : LightThemeColors.menuHover};
      background: none;
    }
    ${tabletAbove`
      font-size: 0.95rem;
      margin: 0 1rem;
      padding: 1rem .5rem;
    `}
  `}
`
