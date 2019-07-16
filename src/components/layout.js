import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { ThemeProvider } from 'styled-components'
// import { useStaticQuery, graphql } from 'gatsby'
import Header from './header'
import { useSiteTheme, GlobalStyle } from './styled/theme'

export const Layout = ({ children }) => {
  const [siteTheme, setSiteTheme] = useSiteTheme()

  return (
    <ThemeProvider theme={{ siteTheme }}>
      <>
        <GlobalStyle />
        <Helmet>
          <meta name="description" content="test" />
        </Helmet>
        <Header siteTitle="test blog" setSiteTheme={setSiteTheme} />
        <main>{children}</main>
      </>
    </ThemeProvider>
  )
}

Layout.propTypes = {
  children: PropTypes.element.isRequired,
}
