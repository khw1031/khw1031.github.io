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

export default function PostsPage({ data, ...props }) {
  const posts = data.allMarkdownRemark.edges;
  const simplifiedPosts = useMemo(
    () => getSimplifiedPosts(posts, { thumbnails: false }),
    [posts]
  );

  const cateogries = getItemsByKey(posts, "categories");
  const tags = getItemsByKey(posts, "tags");

  return (
    <Layout>
      <Helmet title={`글 목록 | ${config.siteTitle}`} />
      <SEO customDescription="생각 정리" />
      <Header>articles</Header>
      <Section>
        <Search posts={simplifiedPosts} {...props} />
      </Section>
    </Layout>
  );
}

export const postsQuery = graphql`
  query PostsQuery {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { template: { eq: "posts" } } }
    ) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            date(formatString: "YYYY-MM-DD")
            title
            description
            thumbnail {
              childImageSharp {
                fluid(maxWidth: 500) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
            tags
            categories
          }
        }
      }
    }
  }
`;
