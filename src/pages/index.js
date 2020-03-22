import React, { useState } from "react";
import Helmet from "react-helmet";
import { graphql } from "gatsby";
import { Layout } from "../components/layout";
import siteMeta from "../../custom/siteMeta";
import { SEO } from "../components/seo";
import { ArticleList } from "../components/articleList";
import { CategoryFilter } from "../components/categoryFilter";
import { SearchBox } from "../components/searchBox";

export default ({ data }) => {
  const articles = data.articles.edges;
  const [searchStr, setSearchStr] = useState("");
  const [currentCategories, setCurrentCategories] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState(() => {
    return data.articles.edges
      .filter(edge => edge.node.frontmatter.template === "article")
      .filter(edge => edge.node.frontmatter.status !== "draft");
  });

  const filterArticles = (value, categories) => {
    let matchedArticles = articles.filter(article => {
      return (
        article.node.frontmatter.template === "article" &&
        article.node.frontmatter.status !== "draft" &&
        article.node.frontmatter.title
          .toLowerCase()
          .includes(value.toLowerCase())
      );
    });
    if (categories.length > 0) {
      matchedArticles = matchedArticles.filter(article => {
        return (
          article.node.frontmatter.categories &&
          categories.every(category =>
            article.node.frontmatter.categories.includes(category)
          )
        );
      });
    }
    setFilteredArticles(matchedArticles);
  };

  const handleSearch = e => {
    const { value } = e.target;
    setSearchStr(value);
    filterArticles(value, currentCategories);
  };

  const updateCategories = category => {
    setCurrentCategories(prevCategories => {
      if (!currentCategories.includes(category)) {
        const categories = [...prevCategories, category];
        filterArticles(searchStr, categories);
        return categories;
      }
      const categories = prevCategories.filter(cat => category !== cat);
      filterArticles(searchStr, categories);
      return categories;
    });
  };

  const filterCount = filteredArticles.length;
  const categories = data.categories.group;

  return (
    <Layout>
      <>
        <Helmet title={`Blog - ${siteMeta.siteTitle}`} />
        <SEO />
        <SearchBox
          searchStr={searchStr}
          handleSearch={handleSearch}
          filterCount={filterCount}
        />
        <CategoryFilter
          categories={categories}
          currentCategories={currentCategories}
          handleCategoryFilter={updateCategories}
        />
        <ArticleList articleEdges={filteredArticles} />
      </>
    </Layout>
  );
};

export const pageQuery = graphql`
  query ArticlesQuery {
    articles: allMarkdownRemark(
      limit: 2000
      sort: { fields: [fields___date], order: DESC }
    ) {
      edges {
        node {
          fields {
            slug
            date
          }
          excerpt(pruneLength: 180)
          timeToRead
          frontmatter {
            title
            status
            tags
            categories
            thumbnail {
              childImageSharp {
                fixed(width: 50, height: 50) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
            date
            template
          }
        }
      }
    }
    categories: allMarkdownRemark(limit: 2000) {
      group(field: frontmatter___categories) {
        fieldValue
        totalCount
      }
    }
  }
`;
