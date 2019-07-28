import React from 'react'
import Img from 'gatsby-image'
import { Link } from 'gatsby'
import moment from 'moment'
import { formatDate } from '../utils/global'

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
    <section>
      {articleList.map(article => {
        let thumbnail
        if (article.thumbnail) {
          thumbnail = article.thumbnail.childImageSharp.fixed
        }

        const popular = article.categories.includes('Popular')
        const date = formatDate(article.date)
        const newest = moment(article.date) > moment().subtract(1, 'months')

        return (
          <Link to={`/articles${article.path}`} key={article.title}>
            <div>
              {thumbnail && <Img fixed={thumbnail} />}
              <div>
                <h2>{article.title}</h2>
                <div>{date}</div>
              </div>
              {newest && (
                <div className='alert'>
                  <div className='new'>New!</div>
                </div>
              )}
              {popular && (
                <div className='alert'>
                  <div className='popular'>Popular</div>
                </div>
              )}
            </div>
          </Link>
        )
      })}
    </section>
  )
}
