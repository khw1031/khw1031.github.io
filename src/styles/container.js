import styled, { css } from 'styled-components'

export const BaseContainer = styled.div.attrs(props => ({
  props,
}))`
  ${props => css`
    max-width: ${props.maxWidth};
    margin: auto;
    padding: 0 1.5rem;
  `}
`
