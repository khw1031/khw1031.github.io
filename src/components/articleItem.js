import React from "react";
import Img from "gatsby-image";
import styled, { css } from "styled-components";
import theme from "styled-theming";
import { Link } from "gatsby";
import moment from "moment";
import { formatDate } from "../utils/global";
import { tabletAbove } from "../styles/mediaQuery";

export const ArticleItem = article => {
  let thumbnail;
  if (article.thumbnail) {
    thumbnail = article.thumbnail.childImageSharp.fixed;
  }

  const popular = article.categories.includes("Popular");
  const date = formatDate(article.date);
  const newest = moment(article.date) > moment().subtract(1, "months");

  return (
    <Link
      style={{ textDecorationLine: "none" }}
      to={`/blogs${article.path}`}
      aria-labelledby={article.title}
    >
      <Item>
        {thumbnail && <Image fixed={thumbnail} />}
        <div>
          <Title>{article.title}</Title>
          <Date dateTime={article.date}>{date}</Date>
        </div>
        {newest && <HighLight type='new'>New!</HighLight>}
        {popular && <HighLight type='popular'>Popular</HighLight>}
      </Item>
    </Link>
  );
};

const ItemCss = theme("siteTheme", {
  light: css`
    border-bottom-color: #f2f2f2;
    :hover,
    :focus,
    :active {
      background: #f2f2f2;
      border-radius: 4px;
    }
  `,
  dark: css`
    border-bottom-color: #343434;
    :hover,
    :focus,
    :active {
      background: #343434;
      border-radius: 4px;
    }
  `,
});

const Item = styled.li`
  display: grid;
  grid-template-columns: 60px 1fr 0;
  align-items: center;
  padding: 1rem 0;
  margin: 0;
  border: 2px solid transparent;
  ${ItemCss}
  ${tabletAbove`
    align-items: start;
    grid-template-columns: 80px 1fr 90px;
    padding: 1rem 2rem;
    margin: 0 -2rem;
  `}
`;

const HighLightCss = theme("siteTheme", {
  light: css`
    color: ${({ type }) => (type === "new" ? "#f7b801" : "#12c47c")};
    background: ${({ type }) => (type === "new" ? "#fff5da" : "#d9fcee")};
  `,
  dark: css`
    color: ${({ type }) => (type === "new" ? "#f7b801" : "#12c47c")};
    background: rgba(0, 0, 0, 0.2);
  `,
});

const HighLight = styled.div`
  display: none;
  font-size: 0.7rem;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  ${HighLightCss}
  align-self: center;
  justify-self: flex-end;
  font-weight: 700;
  ${tabletAbove`
      display: block;
  `}
`;

const Image = styled(Img)`
  min-width: 40px;
  width: 40px !important;
  height: 40px !important;
  ${tabletAbove`
    min-width: 50px;
    width: 50px !important;
    height: 50px !important;
  `}
`;

const TitleCss = theme("siteTheme", {
  light: css`
    color: #111;
  `,
  dark: css`
    color: #ccc;
  `,
});

const Title = styled.h2`
  ${TitleCss}
  font-size: 1rem;
  ${tabletAbove`
    font-size: 1.2rem;
    margin-bottom: 0.4rem;
  `}
`;

const DateCss = theme("siteTheme", {
  light: css`
    color: rgba(0, 0, 0, 0.4);
  `,
  dark: css`
    color: #777c85;
  `,
});

const Date = styled.time`
  display: none;
  ${DateCss}
  font-size: 0.8rem;
  font-weight: 600;
  ${tabletAbove`
    display: block;
  `}
`;
