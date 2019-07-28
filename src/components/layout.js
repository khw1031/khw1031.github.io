import React, { useContext } from 'react'
import Helmet from 'react-helmet'
import styled, { ThemeProvider } from 'styled-components'
import { GlobalStyle } from '../styles/theme'
import { Header } from './header'
import { BaseContainer } from '../styles/container'
import { tabletAbove } from '../styles/mediaQuery'
import ThemeContext from '../themeContext'
import { Footer } from './footer'

export const Layout = ({ children }) => {
  const { dark, toggleDark } = useContext(ThemeContext)
  return (
    <ThemeProvider theme={{ siteTheme: dark ? 'dark' : 'light' }}>
      <>
        <GlobalStyle />
        <Helmet>
          <meta name='description' content='test' />
        </Helmet>
        <Header theme={dark ? 'dark' : 'light'} setSiteTheme={toggleDark} />
        <Main>
          <BaseContainer maxWidth='800px'>{children}</BaseContainer>
        </Main>
        <Footer />
      </>
    </ThemeProvider>
  )
}
const Main = styled.main`
  margin-top: 55px;
  padding: 40px 0 0;
  min-height: calc(100vh - 135px);
  ${tabletAbove`
    margin-top: 92px;
    padding: 60px 0 0;
    min-height: calc(100vh - 219px);
  `}
`
