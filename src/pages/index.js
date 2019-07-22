import React from 'react'
import Helmet from 'react-helmet'
import { useStaticQuery, graphql } from 'gatsby'
import { Layout } from '../components/layout'
// import { Link } from 'gatsby'

// import Layout from '../components/layout'
// import SEO from '../components/seo'

export default () => {
  const data = useStaticQuery(graphql`
    query SiteMetaQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <Layout>
      <>
        <Helmet title={data.site.siteMetadata.title} />
        <div>{data.site.siteMetadata.title}</div>
      </>
    </Layout>
  )
}
