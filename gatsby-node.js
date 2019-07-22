const path = require('path')
const kebabCase = require('lodash.kebabcase')
const moment = require('moment')
const siteConfig = require('./custom/siteMeta')

const postNodes = []

function addSiblingNodes(createNodeField) {
  postNodes.sort(
    ({ frontmatter: { date: date1 } }, { frontmatter: { date: date2 } }) => {
      const dateA = moment(date1, siteConfig.dateFromFormat)
      const dateB = moment(date2, siteConfig.dateFromFormat)

      if (dateA.isBefore(dateB)) return 1
      if (dateB.isBefore(dateA)) return -1

      return 0
    }
  )

  for (let i = 0; i < postNodes.length; i += 1) {
    const nextID = i + 1 < postNodes.length ? i + 1 : 0
    const prevID = i - 1 >= 0 ? i - 1 : postNodes.length - 1
    const currNode = postNodes[i]
    const nextNode = postNodes[nextID]
    const prevNode = postNodes[prevID]

    createNodeField({
      node: currNode,
      name: 'nextTitle',
      value: nextNode.frontmatter.title,
    })

    createNodeField({
      node: currNode,
      name: 'nextSlug',
      value: nextNode.fields.slug,
    })

    createNodeField({
      node: currNode,
      name: 'prevTitle',
      value: prevNode.frontmatter.title,
    })

    createNodeField({
      node: currNode,
      name: 'prevSlug',
      value: prevNode.fields.slug,
    })
  }
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  if (node.internal.type !== 'MarkdownRemark') return

  const { createNodeField } = actions
  let slug
  const fileNode = getNode(node.parent)
  const parsedFilePath = path.parse(fileNode.relativePath)

  if (
    Object.prototype.hasOwnProperty.call(node, 'frontmatter') &&
    Object.prototype.hasOwnProperty.call(node.frontmatter, 'title')
  ) {
    slug = `/${kebabCase(node.frontmatter.title)}/`
  } else if (parsedFilePath.name !== 'index' && parsedFilePath.dir !== '') {
    slug = `/${parsedFilePath.dir}/${parsedFilePath.name}/`
  } else if (parsedFilePath.dir === '') {
    slug = `/${parsedFilePath.name}/`
  } else {
    slug = `/${parsedFilePath.dir}/`
  }

  if (Object.prototype.hasOwnProperty.call(node, 'frontmatter')) {
    if (Object.prototype.hasOwnProperty.call(node.frontmatter, 'slug')) {
      slug = `/${node.frontmatter.slug}/`
    }
    if (Object.prototype.hasOwnProperty.call(node.frontmatter, 'date')) {
      const date = new Date(node.frontmatter.date)

      createNodeField({
        node,
        name: 'date',
        value: date.toISOString(),
      })
    }
  }
  createNodeField({ node, name: 'slug', value: slug })
  postNodes.push(node)
}

exports.setFieldsOnGraphQLNodeType = ({ type, actions }) => {
  const { name } = type
  const { createNodeField } = actions
  if (name === 'MarkdownRemark') {
    addSiblingNodes(createNodeField)
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const articleTemplate = path.resolve('src/templates/article.js')
  const pageTemplate = path.resolve('src/templates/page.js')
  const tagTemplate = path.resolve('src/templates/tag.js')
  const categoryTemplate = path.resolve('src/templates/category.js')

  try {
    const result = await graphql(`
      {
        allMarkdownRemark {
          edges {
            node {
              id
              frontmatter {
                tags
                categories
                template
              }
              fields {
                slug
              }
            }
          }
        }
      }
    `)

    const tagSet = new Set()
    const categorySet = new Set()

    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      if (node.frontmatter.tags) {
        node.frontmatter.tags.forEach(tag => {
          tagSet.add(tag)
        })
      }

      if (node.frontmatter.categories) {
        node.frontmatter.categories.forEach(category => {
          categorySet.add(category)
        })
      }

      if (node.frontmatter.template === 'article') {
        createPage({
          path: `/articles${node.fields.slug}`,
          component: articleTemplate,
          context: {
            slug: node.fields.slug,
          },
        })
      }

      if (node.frontmatter.template === 'page') {
        createPage({
          path: node.fields.slug,
          component: pageTemplate,
          context: {
            slug: node.fields.slug,
          },
        })
      }
    })

    const tagList = [...tagSet]
    tagList.forEach(tag => {
      createPage({
        path: `/tags/${kebabCase(tag)}/`,
        component: tagTemplate,
        context: {
          tag,
        },
      })
    })

    const categoryList = [...categorySet]
    categoryList.forEach(category => {
      createPage({
        path: `/categories/${category.toLowerCase()}/`,
        component: categoryTemplate,
        context: {
          category,
        },
      })
    })
  } catch (err) {
    throw new Error(err.msg)
  }
}
