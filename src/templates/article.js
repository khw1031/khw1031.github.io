import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import Img from 'gatsby-image'
import { Layout } from '../components/layout'
import { formatDate, editOnGithub } from '../utils/global'
import siteMeta from '../../custom/siteMeta'
import { SEO } from '../components/seo'
import { PostTags } from '../components/postTags'
import { UserInfo } from '../components/userInfo'
import { MarkdownContainer } from '../styles/container'

const ArticleTemplate = ({ pageContext, data: { markdownRemark } }) => {
  const { slug } = pageContext
  const postNode = markdownRemark
  const post = markdownRemark.frontmatter
  let thumbnail

  if (post.thumbnail) {
    thumbnail = post.thumbnail.childImageSharp.fixed
  }

  const date = formatDate(post.date)
  const githubLink = editOnGithub(post)

  return (
    <Layout>
      <>
        <Helmet>
          <title>{`${post.title} - ${siteMeta.siteTitle}`}</title>
        </Helmet>
        <SEO postPath={slug} postNode={postNode} postSEO />
        <article>
          <header>
            {thumbnail && <Img fixed={thumbnail} />}
            <div>
              <h1>{post.title}</h1>
              <div>
                <time>{date}</time>
                <a href={githubLink} rel='noopener noreferrer' target='_blank'>
                  Edit on Github{' '}
                  <span role='img' aria-labelledby='pencil icon'>
                    ✏️
                  </span>
                </a>
              </div>
              <PostTags tags={post.tags} />
            </div>
          </header>
          <MarkdownContainer
            dangerouslySetInnerHTML={{ __html: markdownRemark.html }}
          />
        </article>
        <UserInfo />
      </>
    </Layout>
  )
}

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      timeToRead
      excerpt
      frontmatter {
        title
        thumbnail {
          childImageSharp {
            fixed(width: 150, height: 150) {
              ...GatsbyImageSharpFixed
            }
          }
        }
        slug
        date
        categories
        tags
        template
      }
      fields {
        slug
        date
      }
    }
  }
`

export default ArticleTemplate
