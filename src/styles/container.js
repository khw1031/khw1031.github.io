import styled, { css } from 'styled-components'

export const BaseContainer = styled.div`
  ${props => css`
    max-width: ${props.maxWidth || '800px'};
    margin: auto;
    padding: 0 1.5rem;
  `}
`
