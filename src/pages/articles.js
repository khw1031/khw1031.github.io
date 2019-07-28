import React, { useState } from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import { Layout } from '../components/layout'
import siteMeta from '../../custom/siteMeta'
import { SEO } from '../components/seo'
import { ArticleList } from '../components/articleList'

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
          <h1>Articles</h1>
          <ul>
            {categories.map(category => {
              const active = currentCategories
                .includes(category.fieldValue)
                .toString()
              return (
                <li key={category.fieldValue} active={active}>
                  <button
                    type='button'
                    onClick={() => updateCategories(category.fieldValue)}
                  >
                    {category.fieldValue}
                  </button>
                </li>
              )
            })}
          </ul>
          <div>
            <input
              type='text'
              value={searchStr}
              placeholder='제목으로 검색'
              onChange={handleSearch}
            />
            <div>{filterCount}</div>
          </div>
          <ArticleList articleEdges={filteredArticles} />
        </div>
      </>
    </Layout>
  )
}

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
