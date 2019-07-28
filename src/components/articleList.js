import React from 'react'
import styled from 'styled-components'
import { ArticleItem } from './articleItem'

export const ArticleList = ({ articleEdges }) => {
  const articleList = articleEdges
    .filter(edge => edge.node.frontmatter.template === 'article')
    .map(edge => ({
      path: edge.node.fields.slug,
      tags: edge.node.frontmatter.tags,
      thumbnail: edge.node.frontmatter.thumbnail,
      title: edge.node.frontmatter.title,
      date: edge.node.fields.date,
      excerpt: edge.node.excerpt,
      timeToRead: edge.node.timeToRead,
      categories: edge.node.frontmatter.categories,
    }))
  return (
    <List>
      {articleList.map(article => (
        <ArticleItem key={article.title} {...article} />
      ))}
    </List>
  )
}

const List = styled.ul`
  margin: 3rem 0;
`
