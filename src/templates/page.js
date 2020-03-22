import React from "react";
import { graphql } from "gatsby";
import Helmet from "react-helmet";
import { Layout } from "../components/layout";
import siteMeta from "../../custom/siteMeta";
import { SEO } from "../components/seo";
import { MarkdownContainer } from "../styles/container";

const PageTemplate = ({ pageContext, data: { markdownRemark } }) => {
  const { slug } = pageContext;
  const postNode = markdownRemark;
  const page = markdownRemark.frontmatter;

  return (
    <Layout>
      <>
        <Helmet>
          <title>{`${page.title} - ${siteMeta.siteTitle}`}</title>
        </Helmet>
        <SEO postPath={slug} postNode={postNode} postSEO />
        <div className='container'>
          <article>
            <MarkdownContainer
              dangerouslySetInnerHTML={{ __html: postNode.html }}
            />
          </article>
        </div>
      </>
    </Layout>
  );
};

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
`;

export default PageTemplate;
