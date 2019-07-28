import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import theme from 'styled-theming'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import { Layout } from '../components/layout'
import siteMeta from '../../custom/siteMeta'
import { SEO } from '../components/seo'
import { ArticleList } from '../components/articleList'
import {
  LightThemeColors,
  DarkThemeColors,
} from '../../custom/styleScheme/colors'
import { tabletAbove } from '../styles/mediaQuery'
import { CategoryFilter } from '../components/categoryFilter'
import { SearchBox } from '../components/searchBox'

export default ({ data }) => {
  const articles = data.articles.edges
  const [searchStr, setSearchStr] = useState('')
  const [currentCategories, setCurrentCategories] = useState([])
  const [filteredArticles, setFilteredArticles] = useState(data.articles.edges)

  const filterArticles = (value, categories) => {
    let matchedArticles = articles.filter(article => {
      return article.node.frontmatter.title
        .toLowerCase()
        .includes(value.toLowerCase())
    })
    if (categories.length > 0) {
      matchedArticles = matchedArticles.filter(article => {
        return (
          article.node.frontmatter.categories &&
          categories.every(category =>
            article.node.frontmatter.categories.includes(category)
          )
        )
      })
    }
    setFilteredArticles(matchedArticles)
  }

  const handleSearch = e => {
    const { value } = e.target
    setSearchStr(value)
    filterArticles(value, currentCategories)
  }

  const updateCategories = category => {
    setCurrentCategories(prevCategories => {
      if (!currentCategories.includes(category)) {
        const categories = [...prevCategories, category]
        filterArticles(searchStr, categories)
        return categories
      }
      const categories = prevCategories.filter(cat => category !== cat)
      filterArticles(searchStr, categories)
      return categories
    })
  }

  const filterCount = filteredArticles.length
  const categories = data.categories.group

  return (
    <Layout>
      <>
        <Helmet title={`Articles - ${siteMeta.siteTitle}`} />
        <SEO />
        <div>
          <H1>Articles</H1>
          <CategoryFilter
            categories={categories}
            currentCategories={currentCategories}
            handleCategoryFilter={updateCategories}
          />
          <SearchBox
            searchStr={searchStr}
            handleSearch={handleSearch}
            filterCount={filterCount}
          />
          <ArticleList articleEdges={filteredArticles} />
        </div>
      </>
    </Layout>
  )
}

const H1 = styled.h1`
  ${theme('siteTheme', {
    light: css`
      color: ${LightThemeColors.headerColor};
    `,
    dark: css`
      color: ${DarkThemeColors.headerColor};
    `,
  })}
  font-size: 1.5rem;
  margin: 0 0 1rem;
  font-weight: 800;
  ${tabletAbove`
    font-size: 2.25rem;
    margin: 0 0 2rem;
  `}
`

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
            tags
            categories
            thumbnail {
              childImageSharp {
                fixed(width: 150, height: 150) {
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
`
