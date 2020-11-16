import { Link as _Link } from "gatsby";
import React from "react";
import styled from "styled-components";

export default function AbsoluteLink({ ...props }) {
  return <Link {...props} />;
}

const Link = styled(_Link)`
  position: absolute;
  display: block;
  z-index: var(--z-link);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;
