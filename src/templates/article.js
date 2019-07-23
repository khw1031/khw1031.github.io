import React from 'react'
// import Helmet from 'react-helmet'
// import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { Layout } from '../components/layout'
// import siteMeta from '../../custom/siteMeta'
import { PageContextTypes, PostDataTypes } from '../types'

const ArticleTemplate = ({ /* pageContext */ data: { markdownRemark } }) => {
  // const { slug } = pageContext

  return (
    <Layout>
      <>
        <div dangerouslySetInnerHTML={{ __html: markdownRemark.html }} />
      </>
    </Layout>
  )
}

ArticleTemplate.propTypes = {
  // pageContext: PageContextTypes.isRequired,
  data: PostDataTypes.isRequired,
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
