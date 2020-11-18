import React from "react";
import { graphql, Link } from "gatsby";
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
  const prevLink = previous?.fields?.slug;
  const prevTitle = previous?.frontmatter.title;
  const nextLink = next?.fields?.slug;
  const nextTitle = next?.frontmatter.title;

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
        <Cover className="cover_below__md">
          <LinkCover>
            {prevLink && <Prev to={prevLink}>{prevTitle}</Prev>}
          </LinkCover>
          <LinkCover>
            {nextLink && <Next to={nextLink}>{nextTitle}</Next>}
          </LinkCover>
        </Cover>
      </Section>
    </Layout>
  );
}

const Cover = styled.div`
  border-top: 1px solid var(--color-inversedFont);
  display: grid;
  grid-template-columns: repeat(2, calc(50% - 10px));
  align-items: center;
  gap: 20px;
`;
const LinkCover = styled.div`
  margin-top: 10px;
`;
const _Link = styled(Link)`
  display: flex;
  align-items: center;
  height: 80px;
  width: 100%;
  cursor: pointer;
  padding: 0 10px;
  transition: background 0.6s;
  :hover {
    background: var(--color-inversedFont);
  }
  font-size: 0.85rem;
`;
const Prev = styled(_Link)`
  ::before {
    content: "<";
    padding-right: 0.4rem;
  }
`;
const Next = styled(_Link)`
  ::after {
    content: ">";
    padding-left: 0.4rem;
  }
  justify-content: flex-end;
`;

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
    markdownRemark(
      fields: { slug: { eq: $slug } }
      frontmatter: { status: { eq: "published" } }
    ) {
      html
      timeToRead
      excerpt
      fields {
        slug
      }
      frontmatter {
        title
        status
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
