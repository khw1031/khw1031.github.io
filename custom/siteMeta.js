const siteMeta = {
  siteTitle: '김현우 | 웹 개발자',
  siteTitleShort: 'Hyunwoo Kim',
  siteTitleAlt: 'Hyunwoo Kim',
  siteLogo: '/logos/terminal_dark.svg',
  dateFromFormat: 'YYYY-MM-DD',
  siteUrl: 'https://khw1031.github.io',
  repo: 'https://github.com/khw1031/khw1031.github.io',
  pathPrefix: '',
  siteDescription: '김현우 풀스택 자바스크립트 개발자',
  siteRss: '/rss.xml',
}

if (siteMeta.pathPrefix === '/') {
  siteMeta.pathPrefix = ''
} else {
  siteMeta.pathPrefix = `/${siteMeta.pathPrefix.replace(/^\/|\/$/g, '')}`
}

if (siteMeta.siteUrl.substr(-1) === '/') siteMeta.siteUrl = siteMeta.siteUrl.slice(0, -1)

if (siteMeta.siteRss && siteMeta.siteRss[0] !== '/') siteMeta.siteRss = `/${siteMeta.siteRss}`

module.exports = siteMeta
