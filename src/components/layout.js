import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import styled, { ThemeProvider } from 'styled-components'
// import { useStaticQuery, graphql } from 'gatsby'
import { useSiteTheme, GlobalStyle } from '../styles/theme'
import { Header } from './header'
import { BaseContainer } from '../styles/container'
import { tabletAbove } from '../styles/mediaQuery'

export const Layout = ({ children }) => {
  const [siteTheme, setSiteTheme] = useSiteTheme()
  return (
    <ThemeProvider theme={{ siteTheme }}>
      <>
        <GlobalStyle />
        <Helmet>
          <meta name='description' content='test' />
        </Helmet>
        <Header theme={siteTheme} setSiteTheme={setSiteTheme} />
        <Main>
          <Div maxWidth='800px'>{children}</Div>
        </Main>
      </>
    </ThemeProvider>
  )
}
const Main = styled.main`
  margin-top: 55px;
  padding: 40px 0 0;
  min-height: calc(100vh - 162px);
  ${tabletAbove`
    margin-top: 92px;
    padding: 60px 0 0;
  `}
`

const Div = styled(BaseContainer)``

Layout.propTypes = {
  children: PropTypes.element.isRequired,
}
