import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import styled, { css } from 'styled-components'

const Header = ({ siteTitle, setSiteTheme }) => (
  <StyledHeader>
    <div>
      <h1>
        <Link to="/">{siteTitle}</Link>
      </h1>
      <button type="button" onClick={setSiteTheme}>
        테마 변경
      </button>
    </div>
  </StyledHeader>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
  setSiteTheme: PropTypes.func.isRequired,
}

Header.defaultProps = {
  siteTitle: ``,
}

const StyledHeader = styled.header`
  ${props =>
    props.theme.siteTheme === 'dark'
      ? css`
          background: #f0f0f0;
        `
      : css`
          background: yellow;
        `}
`

export default Header
