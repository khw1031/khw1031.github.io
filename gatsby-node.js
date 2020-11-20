const path = require("path");
const kebabCase = require("lodash.kebabcase");

const onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const templateName = node.frontmatter.template || "posts";
    const slug = node.frontmatter.slug
      ? `/${templateName}/${kebabCase(node.frontmatter.slug)}/`
      : `/${templateName}/${kebabCase(node.frontmatter.title)}/`;

    createNodeField({ node, name: "slug", value: slug });
  }
};

const createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const postTemplate = path.resolve(`src/templates/post.js`);
  const tagTemplate = path.resolve(`src/templates/tag.js`);
  const categoryTemplate = path.resolve(`src/templates/category.js`);
  const aboutTemplate = path.resolve(`src/templates/about.js`);
  const portfolioTemplate = path.resolve(`src/templates/portfolio.js`);

  const result = await graphql(`
    {
      allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
        edges {
          node {
            id
            frontmatter {
              title
              tags
              categories
              template
              status
            }
            fields {
              slug
            }
          }
        }
      }
    }
  `);

  if (result.errors) {
    throw result.errors;
  }

  const all = result.data.allMarkdownRemark.edges;
  const posts = all.filter(
    post =>
      post.node.frontmatter.template === "posts" &&
      post.node.frontmatter.status === "published"
  );

  const tagSet = new Set();
  const categorySet = new Set();

  /** Posts */
  posts.forEach((post, i) => {
    const previous = i === posts.length - 1 ? null : posts[i + 1].node;
    const next = i === 0 ? null : posts[i - 1].node;

    if (post.node.frontmatter.tags) {
      post.node.frontmatter.tags.forEach(tag => tagSet.add(tag));
    }
    if (post.node.frontmatter.categories) {
      post.node.frontmatter.categories.forEach(category =>
        categorySet.add(category)
      );
    }

    createPage({
      path: post.node.fields.slug,
      component: postTemplate,
      context: {
        slug: post.node.fields.slug,
        previous,
        next,
      },
    });
  });

  /** Pages */
  createPage({
    path: `/about/`,
    component: aboutTemplate,
  });
  createPage({
    path: `/portfolio/`,
    component: portfolioTemplate,
  });

  /** Tags */
  [...tagSet].forEach(tag => {
    createPage({
      path: `/tags/${kebabCase(tag)}/`,
      component: tagTemplate,
      context: {
        tag,
      },
    });
  });

  /** Categories */
  [...categorySet].forEach(category => {
    createPage({
      path: `/categories/${kebabCase(category)}/`,
      component: categoryTemplate,
      context: {
        category,
      },
    });
  });
};

exports.createPages = createPages;
exports.onCreateNode = onCreateNode;
