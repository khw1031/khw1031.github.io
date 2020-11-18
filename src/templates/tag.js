import { graphql } from "gatsby";
import React from "react";
import { useMemo } from "react";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import _Header from "../components/header";
import Layout from "../components/layout";
import PostList from "../components/postList";
import Section from "../components/section";
import SEO from "../components/seo";
import config from "../utils/config";
import { capitalize, getSimplifiedPosts } from "../utils/helpers";

export default function TagTemplate({ data, pageContext }) {
  const { tag } = pageContext;
  const { totalCount } = data.allMarkdownRemark;
  const posts = data.allMarkdownRemark.edges;

  const simplifiedPosts = useMemo(
    () => getSimplifiedPosts(posts, { thumbnails: false }),
    [posts]
  );

  return (
    <Layout>
      <Helmet title={`${tag}가 태그된 글 목록 | ${config.siteTitle}`} />
      <SEO customDescription={`${tag} 태그와 관련된 포스팅 리스트`} />
      <Header>#{capitalize(tag)}</Header>
      <Counter>총 {totalCount}개의 글</Counter>
      <Section>
        <PostList data={simplifiedPosts} />
      </Section>
    </Layout>
  );
}

const Header = styled(_Header)`
  color: var(--color-subHeading);
`;

const Counter = styled.h3`
  text-align: end;
  font-size: var(--font-size-section-subtwo);
`;

export const pageQuery = graphql`
  query PostsByTag($tag: String!) {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: {
        frontmatter: { tags: { in: [$tag] }, status: { eq: "published" } }
      }
    ) {
      totalCount
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            date(formatString: "YYYY-MM-DD")
            title
            status
            description
            thumbnail {
              childImageSharp {
                fluid(maxWidth: 500) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
`;
