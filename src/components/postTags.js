import React from 'react'
import kebabCase from 'lodash.kebabcase'
import { Link } from 'gatsby'

export const PostTags = ({ tags }) => {
  return (
    <div className='tag-container'>
      {tags &&
        tags.map(tag => (
          <Link
            key={tag}
            style={{ textDecoration: 'none' }}
            to={`/tags/${kebabCase(tag)}/`}
          >
            <span>{tag}</span>
          </Link>
        ))}
    </div>
  )
}
