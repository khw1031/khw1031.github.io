import React from "react";
import styled from "styled-components";
import { tabletAbove } from "../styles/mediaQuery";

export default function Footer() {
  return (
    <Container>
      <Inner>
        <Rights>
          copyright ⓒ {new Date().getFullYear()} Hyunwoo Kim all rights reserved
        </Rights>
        <Rights>✉️ &nbsp;khw1031@gmail.com</Rights>
      </Inner>
    </Container>
  );
}

const Container = styled.footer`
  max-width: var(--container-max-width);
  margin: var(--container-margin);
  margin-top: 4rem;
  padding: var(--container-pad);
`;

const Inner = styled.div`
  padding: 2rem 0;
`;

const Rights = styled.p`
  text-align: center;
  color: #ccc;
  font-size: 0.85rem;
  ${tabletAbove`
    text-align: end;
  `}
`;
