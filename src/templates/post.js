import React from "react";
import { graphql } from "gatsby";
import styled from "styled-components";
import Layout from "../components/layout";
import Helmet from "react-helmet";
import config from "../utils/config";
import SEO from "../components/seo";
import Section from "../components/section";
import _Header from "../components/header";
import { mobileLAbove } from "../styles/mediaQuery";
import markdownStyle from "../styles/markdownStyle";

export default function PostTemplate({ data, pageContext }) {
  const post = data.markdownRemark;
  const { previous, next } = pageContext;
  // const { thumbnail } = post.frontmatter;
  console.log(previous, next);

  const dateTime = new Date(post.frontmatter.date);

  return (
    <Layout>
      <Helmet title={`${post.frontmatter.title} | ${config.siteTitle}`} />
      <SEO
        postPath={post.fields.slug}
        postNode={post}
        customTitle={post.frontmatter.metaTitle}
        customDescription={post.frontmatter.description}
        postSEO
      />
      <Section>
        <Header>{post.frontmatter.title}</Header>
        <Time dateTime={dateTime}>{post.frontmatter.date}</Time>
        <Article dangerouslySetInnerHTML={{ __html: post.html }} />
      </Section>
    </Layout>
  );
}

const Header = styled(_Header)`
  .section__title {
    font-family: var(--font-family-serif);
    color: var(--color-subHeading);
    font-size: 1.2rem;
    margin-top: 4rem;
    font-style: italic;
    ${mobileLAbove`
      font-size: 1.4rem;
      margin-top: 6rem;
    `}
  }
`;

const Time = styled.time`
  display: block;
  font-size: 0.8rem;
  text-align: center;
  font-weight: var(--font-weight-light);
`;

const Article = styled.article`
  ${markdownStyle}
`;

export const pageQuery = graphql`
  query PostBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      timeToRead
      excerpt
      fields {
        slug
      }
      frontmatter {
        title
        status
        slug
        metaTitle
        description
        date(formatString: "MMMM DD, YYYY")
        categories
        tags
        template
        thumbnail {
          childImageSharp {
            fixed(width: 150, height: 150) {
              ...GatsbyImageSharpFixed
            }
          }
        }
      }
    }
  }
`;
