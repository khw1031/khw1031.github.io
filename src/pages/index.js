import React, { useMemo } from "react";
import { graphql } from "gatsby";
import { Helmet } from "react-helmet";

import Layout from "../components/layout";
import SEO from "../components/seo";

import config from "../utils/config";
import Search from "../components/search";

import { getSimplifiedPosts, getItemsByKey } from "../utils/helpers";
import Section from "../components/section";
import Header from "../components/header";

export default function IndexPage({ data, ...props }) {
  return (
    <Layout>
      <Helmet title={`글 목록 | ${config.siteTitle}`} />
      <SEO customDescription="기억 저장소" />
      <Section></Section>
    </Layout>
  );
}
