import React from 'react'

export const Contact = () => {
  return (
    <>
      <h2>Contact</h2>
      <ul>
        <li>
          <strong>Email</strong>:{' '}
          <a href='mailto:work.hyunwoo@gmail.com'>work.hyunwoo@gmail.com</a>
        </li>
        <li>
          <strong>GitHub</strong>:{' '}
          <a
            target='_blank'
            rel='noopener noreferrer'
            href='https://github.com/khw1031'
          >
            khw1031
          </a>
        </li>
        <li>
          <strong>LinkedIn</strong>:{' '}
          <a
            target='_blank'
            rel='noopener noreferrer'
            href='https://www.linkedin.com/in/hyunwoo-kim-779724119/'
          >
            Hyunwoo Kim
          </a>
        </li>
        <li>
          <strong>Feed</strong>:{' '}
          <a href='https://khw1031.github.io/rss.xml'>RSS</a>
        </li>
      </ul>
    </>
  )
}
