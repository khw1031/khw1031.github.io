import React from "react";
import Layout from "../components/layout";

function CategoryTemplate({ pageContext }) {
  const category = pageContext.category;
  return <Layout>{category}</Layout>;
}

export default CategoryTemplate;
