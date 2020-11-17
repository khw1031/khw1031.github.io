import React from "react";
import Layout from "../components/layout";
import styled from "styled-components";
import SEO from "../components/seo";
import Section from "../components/section";
import Header from "../components/header";
import { mobileLAbove } from "../styles/mediaQuery";

export default ({ data }) => {
  const post = data.markdownRemark;
  const dateTime = new Date(post.frontmatter.date);

  return (
    <Layout>
      <SEO customTitle={`about`} customDescription="개발자 김현우 간단 이력" />
      <Header>about</Header>
      <Section>
        <Time dateTime={dateTime}>
          <span>last updated: </span>
          {post.frontmatter.date}
        </Time>
        <Article dangerouslySetInnerHTML={{ __html: post.html }} />
      </Section>
    </Layout>
  );
};

const Article = styled.article`
  margin-top: 4rem;
  ${mobileLAbove`
    margin-top: 6rem;
  `};
  h2 {
    font-size: 0.65rem;
    color: var(--color-subHeading);
    letter-spacing: 1.2px;
    &:not(:first-of-type) {
      margin-top: 3rem;
    }
    ${mobileLAbove`
      font-size: 0.8rem;
    `};
  }

  h3 {
    font-size: 0.85rem;
    padding: 0 0.25rem;
    display: inline-block;
    background: var(--color-font);
    color: var(--color-inversedFont);
    ${mobileLAbove`
      font-size: 0.9rem;
    `};
  }

  h2 + h3 {
    margin-top: 0;
  }

  ul {
    padding-left: 0.25rem;
  }
  ul + h3 {
    margin-top: 2.5rem;
  }
  ul + ul {
    margin-top: 2rem;
  }
  li + li {
    margin-top: 4px;
  }
  li ul {
    margin-top: 8px;
    padding-left: 0.8rem;
  }
  li {
    font-size: 0.85rem;
    letter-spacing: 0.9px;
    word-wrap: break-word;
    ${mobileLAbove`
      font-size: 0.9rem;
    `};
  }

  a {
    color: var(--color-secondary);
    text-decoration: underline;
    svg {
      width: 12px;
      height: 12px;
    }
    svg path {
      fill: var(--color-gray700);
    }
  }
`;

const Time = styled.time`
  display: block;
  font-size: 0.8rem;
  text-align: center;
  font-weight: var(--font-weight-light);
  color: var(--color-secondary);
`;

export const aboutQuery = graphql`
  query AboutQuery {
    markdownRemark(frontmatter: { template: { eq: "about" } }) {
      html
      frontmatter {
        title
        status
        slug
        metaTitle
        description
        date(formatString: "YYYY-MM-DD")
        categories
        tags
        template
      }
    }
  }
`;
