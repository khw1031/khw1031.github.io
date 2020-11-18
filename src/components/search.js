import React, { useState } from "react";
import styled from "styled-components";
import { parse } from "query-string";
import PostList from "../components/postList";
import { mobileLAbove } from "../styles/mediaQuery";
import { getItemsByKey } from "../utils/helpers";

export default function Search({ posts, location, navigate }) {
  const { search } = parse(location.search);
  const [query, setQuery] = useState(search || "");

  const results = posts.filter(({ categories = [], tags = [], title = "" }) => {
    let q = query.toLowerCase();
    return (
      categories.join("").toLowerCase().includes(q) ||
      tags.join("").toLowerCase().includes(q) ||
      title.toLowerCase().includes(q)
    );
  });

  const onQueryChange = e => {
    const value = e.target.value;
    navigate(value ? `/?search=${value}` : ``);
    setQuery(value);
  };

  return (
    <React.Fragment>
      <InputCover>
        <Input
          type="search"
          placeholder="포스트 검색"
          value={query}
          onChange={onQueryChange}
        />
      </InputCover>
      <section>
        {query ? (
          results.length > 0 ? (
            <PostList data={results} />
          ) : (
            <p>검색 결과가 없습니다.</p>
          )
        ) : (
          <PostList data={posts} showYears />
        )}
      </section>
    </React.Fragment>
  );
}

const InputCover = styled.div`
  width: 100%;
  height: 2.5rem;
  ${mobileLAbove`
    width: 100%;
    max-width: 22.5rem;
    height: 3rem;
    margin: auto;
  `}
`;
const Input = styled.input`
  font-size: 1rem;
  height: 100%;
  width: 100%;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid var(--color-gray300);
  ${mobileLAbove`
    font-size: 1.2rem;
  `}
`;
