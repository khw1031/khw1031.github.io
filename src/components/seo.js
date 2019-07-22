import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import urljoin from 'url-join/lib/url-join'
import siteMeta from '../../custom/siteMeta'

export const SEO = ({ postNode, postPath, postSEO }) => {
  let title
  let description
  let postUrl
  let imageUrl = ''

  if (postSEO) {
    const postMeta = postNode.frontmatter
    title = postMeta.title
    description = postMeta.description ? postMeta.description : postNode.excerpt
    if (postMeta.thumbnail) {
      imageUrl = postMeta.thumbnail.childImageSharp.fixed.src
    }
    postUrl = urljoin(siteMeta.siteUrl, postPath)
  } else {
    title = siteMeta.siteTitle
    description = siteMeta.siteDescription
    imageUrl = siteMeta.siteLogo
  }

  imageUrl = urljoin(siteMeta.siteUrl, imageUrl)
  const blogUrl = urljoin(siteMeta.siteUrl, siteMeta.pathPrefix)
  const schemaOrgJSONLD = [
    {
      '@context': 'http://schema.org',
      '@type': 'WebSite',
      url: blogUrl,
      name: title,
      alternateName: siteMeta.siteTitleAlt ? siteMeta.siteTitleAlt : '',
    },
  ]

  if (postSEO) {
    schemaOrgJSONLD.push(
      {
        '@context': 'http://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            item: {
              '@id': postUrl,
              name: title,
              imageUrl,
            },
          },
        ],
      },
      {
        '@context': 'http://schema.org',
        '@type': 'BlogPosting',
        url: blogUrl,
        name: title,
        alternateName: siteMeta.siteTitleAlt ? siteMeta.siteTitleAlt : '',
        headline: title,
        image: {
          '@type': 'ImageObject',
          url: imageUrl,
        },
        description,
      }
    )
  }

  return (
    <Helmet htmlAttributes={{ lang: 'ko' }}>
      <meta name='description' content={description} />
      <meta name='image' content={imageUrl} />
      <script type='application/ld+json'>
        {JSON.stringify(schemaOrgJSONLD)}
      </script>

      <meta property='og:url' content={postSEO ? postUrl : blogUrl} />
      {postSEO ? <meta property='og:type' content='article' /> : null}
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:image' content={imageUrl} />

      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={imageUrl} />
    </Helmet>
  )
}

SEO.defaultProps = {
  postSEO: false,
}

SEO.propTypes = {
  postNode: PropTypes.shape({
    excerpt: PropTypes.string,
    frontmatter: PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      thumbnail: PropTypes.shape({
        childImageSharp: PropTypes.shape({
          fixed: PropTypes.shape({
            src: PropTypes.string,
          }),
        }),
      }),
    }).isRequired,
  }).isRequired,
  postPath: PropTypes.string.isRequired,
  postSEO: PropTypes.bool,
}
