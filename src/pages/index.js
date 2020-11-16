import React from "react";
import { Link } from "gatsby";
import Layout from "../components/layout";
import styled from "styled-components";

import { Helmet } from "react-helmet";
import SEO from "../components/seo";
import config from "../utils/config";
import Header from "../components/header";
import Section from "../components/section";

function IndexPage() {
  return (
    <Layout>
      <Helmet title={config.siteTitle} />
      <SEO customDescription="라이프 블로그" />
      <Header>what?</Header>
      <Section>section</Section>
    </Layout>
  );
}

export default IndexPage;
