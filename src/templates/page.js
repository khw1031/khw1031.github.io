import React from 'react'
import styled, { css } from 'styled-components'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import { Layout } from '../components/layout'
import siteMeta from '../../custom/siteMeta'
import {
  LightThemeColors,
  DarkThemeColors,
} from '../../custom/styleScheme/colors'
import { tabletAbove } from '../styles/mediaQuery'
import { SEO } from '../components/seo'
import { MarkdownContainer } from '../styles/container'

const PageTemplate = ({ pageContext, data: { markdownRemark } }) => {
  const { slug } = pageContext
  const postNode = markdownRemark
  const page = markdownRemark.frontmatter

  return (
    <Layout>
      <>
        <Helmet>
          <title>{`${page.title} - ${siteMeta.siteTitle}`}</title>
        </Helmet>
        <SEO postPath={slug} postNode={postNode} postSEO />
        <div className='container'>
          <article>
            <header className='page-header'>
              <H1>{page.title}</H1>
            </header>
            <MarkdownContainer
              dangerouslySetInnerHTML={{ __html: postNode.html }}
            />
          </article>
        </div>
      </>
    </Layout>
  )
}

export const pageQuery = graphql`
  query PageBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      timeToRead
      excerpt
      frontmatter {
        title
        template
      }
      fields {
        slug
        date
      }
    }
  }
`

const H1 = styled.h1`
  ${props => css`
    margin: 0 0 1rem;
    font-size: 1.5rem;
    font-weight: 800;
    color: ${props.theme.siteTheme === 'light'
      ? LightThemeColors.headerColor
      : DarkThemeColors.headerColor};
    ${tabletAbove`
    margin: 0 0 2rem;
    font-size: 2.25rem;
    font-weight: 800;
  `}
  `}
`

export default PageTemplate
