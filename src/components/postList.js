import React from "react";
import styled from "styled-components";
import PostRow from "./postRow";

import { go, map, head, entriesL, sortByDesc, groupBy } from "fxjs";
import { mobileLAbove } from "../styles/mediaQuery";

export default function PostList({ data, showYears }) {
  const yearPostsMap = go(
    data,
    groupBy(post => post.date.split("-")[0]),
    entriesL,
    sortByDesc(head)
  );

  return (
    <Inner>
      {map(
        ([year, posts]) => (
          <YearBlock key={year}>
            {showYears && <Year>{year}</Year>}
            {posts.map(post => (
              <Post key={post.id} post={post} />
            ))}
          </YearBlock>
        ),
        yearPostsMap
      )}
    </Inner>
  );
}

const Inner = styled.div`
  margin-top: 2rem;
`;

const YearBlock = styled.div`
  :not(:last-child) {
    margin-bottom: 3rem;
  }
`;

const Year = styled.h3`
  font-size: 1.2rem;
  line-height: 1.8;
  color: var(--color-subHeading);
  border-bottom: 1px solid var(--border);
  font-family: var(--font-family-serif);
  margin-bottom: 1rem;
  ${mobileLAbove`
    font-size: 1.8rem;
    margin-bottom: 1.2rem;
  `}
`;

const Post = styled(PostRow)`
  :not(:last-child) {
    margin-bottom: 1rem;
  }
`
