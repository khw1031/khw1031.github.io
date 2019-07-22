import React from 'react'
import styled, { css } from 'styled-components'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import PropTypes from 'prop-types'
import { Layout } from '../components/layout'
import siteMeta from '../../custom/siteMeta'
import {
  LightThemeColors,
  DarkThemeColors,
} from '../../custom/styleScheme/colors'
import { tabletAbove } from '../styles/mediaQuery'
import { SEO } from '../components/seo'

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
            <PageMarkdown dangerouslySetInnerHTML={{ __html: postNode.html }} />
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

PageTemplate.propTypes = {
  pageContext: PropTypes.shape({
    slug: PropTypes.string.isRequired,
  }).isRequired,
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
}

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

const PageMarkdown = styled.div.attrs(props => ({
  theme: props.theme.siteTheme,
}))`
  ${({ theme }) => css`
    h2,
    h3 {
      color: ${theme === 'light'
        ? LightThemeColors.headerColor
        : DarkThemeColors.headerColor};
      font-weight: 700;
      margin: 0 0 1rem;
      ${tabletAbove`
        margin: 0 0 1.5rem;
      `}
    }

    h2 {
      padding-bottom: 0.5rem;
      font-size: 1.3rem;
      line-height: 1.3;
      border-bottom: 2px solid
        ${theme === 'light'
          ? LightThemeColors.headerBorderBottom
          : DarkThemeColors.headerBorderBottom};
      ${tabletAbove`
        font-size: 1.5rem;
      `}
      &:not(:first-child) {
        margin-top: 3rem;
        ${tabletAbove`
          margin-top: 3.5rem;
        `}
      }
    }
    h3 {
      margin: 0 0 1rem;
      font-size: 1.15rem;
      &:not(:first-child) {
        margin-top: 3rem;
      }
      ${tabletAbove`
        margin: 0 0 1.5rem;
        font-size: 1.25rem;
      `}
    }

    a.anchor {
      border-bottom: none;
      &:hover,
      &:focus,
      &:active {
        background: none;
        border-bottom: none;
      }
    }

    a {
      color: ${theme === 'light'
        ? LightThemeColors.link
        : DarkThemeColors.link};
      ${theme === 'light'
        ? css`
            border-bottom: 2px solid ${LightThemeColors.linkBorder};
          `
        : css`
            border-bottom: none;
          `}
      font-weight: 600;
      text-decoration-line: none;
      &:hover,
      &:focus,
      &:active {
        color: ${theme === 'light'
          ? LightThemeColors.linkHover
          : DarkThemeColors.linkHover};
        background: ${theme === 'light' ? LightThemeColors.linkHoverBg : ''};
        border-bottom: 2px solid
          ${theme === 'light'
            ? LightThemeColors.linkHover
            : DarkThemeColors.linkBorder};
      }
      &:active {
        border-bottom: 2px dashed
          ${theme === 'light'
            ? LightThemeColors.linkHover
            : DarkThemeColors.linkBorder};
      }
    }

    p {
      line-height: 1.8;
      font-size: 0.85rem;
      word-break: keep-all;
      word-wrap: break-word;
      ${tabletAbove`
        font-size: 1rem;
        line-height: 1.8;
      `}
    }

    ul,
    ol {
      li {
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
        ${tabletAbove`
          font-size: 1rem;
        `}
      }
    }
  `}
`

export default PageTemplate
