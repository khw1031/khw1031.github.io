import { PropTypes } from 'prop-types'

export const PageContextTypes = PropTypes.shape({
  slug: PropTypes.string.isRequired,
})

export const PostDataTypes = PropTypes.shape({
  markdownRemark: PropTypes.shape({
    html: PropTypes.string.isRequired,
    timeToRead: PropTypes.number.isRequired,
    excerpt: PropTypes.string.isRequired,
    frontmatter: PropTypes.shape({
      title: PropTypes.string.isRequired,
      thumbnail: PropTypes.shape({
        childImageSharp: PropTypes.shape({
          fixed: PropTypes.shape({
            base64: PropTypes.string.isRequired,
            height: PropTypes.number.isRequired,
            width: PropTypes.number.isRequired,
            src: PropTypes.string.isRequired,
            srcSet: PropTypes.string.isRequired,
          }),
        }),
      }),
      slug: PropTypes.string.isRequired,
      date: PropTypes.string,
      categories: PropTypes.array,
      tags: PropTypes.array,
      template: PropTypes.string.isRequired,
    }).isRequired,
    fields: PropTypes.shape({
      slug: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
})
