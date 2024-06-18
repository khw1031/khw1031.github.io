/** @type {import('next').NextConfig} */

import nextMdx from "@next/mdx";

const withMdx = nextMdx({
  extension: /.mdx?$/,
});
const nextConfig = withMdx({
  output: "export",
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
});

export default nextConfig;

// https://mdxjs.com/docs/getting-started
