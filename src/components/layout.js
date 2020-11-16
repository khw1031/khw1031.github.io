import React from "react";

import Navigation from "./nav";
import Footer from "./footer";
import { Helmet } from "react-helmet";
import styled from "styled-components";

const Layout = ({ children }) => {
  return (
    <React.Fragment>
      <Helmet>
        <html lang="ko" />
      </Helmet>
      <Navigation />
      <Main>{children}</Main>
      <Footer />
    </React.Fragment>
  );
};

const Main = styled.main`
  max-width: var(--container-max-width);
  margin: var(--container-margin);
  margin-top: var(--stack-main);
  padding: var(--container-pad);
`;

export default Layout;
