import React from "react";
import styled from "styled-components";
import kebabCase from "lodash.kebabcase";
import { Link } from "gatsby";

import { go, split, tail, mapL, head, join, takeAll, log, map } from "fxjs";

import { mobileLAbove } from "../styles/mediaQuery";
import ImgWrap from "./imgWrap";
import { capitalize } from "../utils/helpers";

export default function PostRow({ post, ...props }) {
  const date = go(post.date, split("-"), tail, join("/"));
  const hasThumb = !!post.thumbnail;

  // const categories = go(
  //   post.categories,
  //   mapL(name => ({
  //     name,
  //     slug: `/categories/${kebabCase(name)}`,
  //   }))
  // );

  const tags = go(
    post.tags,
    mapL(name => ({
      name,
      slug: `/tags/${kebabCase(name)}`,
    }))
  );

  return (
    <Article {...props}>
      <Info>
        <Time dateTime={post.date}>{date}</Time>
        <div>
          <Title>
            <Link to={post.slug}>{post.title}</Link>
          </Title>
          <Inner>
            <Tags>
              {map(
                t => (
                  <Link key={t.slug} to={t.slug}>
                    <Tag>#{capitalize(t.name)}</Tag>
                  </Link>
                ),
                tags
              )}
            </Tags>
          </Inner>
        </div>
      </Info>
      {hasThumb && <Image src={post.thumbnail} />}
    </Article>
  );
}

const Article = styled.article`
  padding: 0.8rem 0rem;
  display: flex;
`;

const Info = styled.div`
  margin-right: auto;
  display: flex;
  align-items: center;
`;

const Time = styled.time`
  color: #adb5bd;
  font-weight: var(--font-weight-light);
  font-size: 0.75rem;
  margin: 0 0.8rem 0.6rem 0;
  min-width: 40px;
  ${mobileLAbove`
    font-size: 1rem;
    margin: 0 2rem 0.6rem 0;
  `}
`;

const Inner = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Tags = styled.div`
  padding: 0.5rem 0;
  flex: 0 0 auto;

  a + a {
    margin-left: 0.5rem;
  }
`;

const Tag = styled.span`
  font-size: 0.8rem;
  color: #ccc;
  :hover {
    text-decoration: underline;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.2rem;
  word-break: keep-all;
  ${mobileLAbove`
    font-size: 1.6rem;
  `}
  :hover {
    text-decoration: underline;
  }
`;

const Image = styled(ImgWrap)`
  flex-basis: 100%;
  max-width: 50px;
  ${mobileLAbove`
    max-width: 60px;
  `}
`;
