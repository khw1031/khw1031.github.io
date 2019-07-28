import urljoin from 'url-join'
import moment from 'moment'
import siteMeta from '../../custom/siteMeta'

export const formatDate = date => moment.utc(date).format(siteMeta.dateFormat)

export const editOnGithub = post => {
  const date = moment.utc(post.date).format(siteMeta.dateFromFormat)
  return urljoin(
    siteMeta.repo,
    '/blob/dev/content/posts',
    `${date}-${post.slug}.md`
  )
}
