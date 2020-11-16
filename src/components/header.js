import React from "react";
import styled from "styled-components";

export default function Header({ children, ...props }) {
  return (
    <Container {...props}>
      <Wrapper>
        <SectionTitle className={`section__title`}>{children}</SectionTitle>
      </Wrapper>
    </Container>
  );
}

const Container = styled.header`
  padding: var(--header-pad);
`;

const Wrapper = styled.div`
  text-align: center;
`;

const SectionTitle = styled.h1`
  color: inherit;
  font-family: var(--font-family-serif);
  margin-top: var(--stack-section-title);
  font-size: calc(var(--font-size-section-headone) * 0.8);
`;
