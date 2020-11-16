import React from "react";
import styled from "styled-components";

export default function Section({ children, ...props }) {
  return <Container {...props}>{children}</Container>;
}

const Container = styled.section``;
