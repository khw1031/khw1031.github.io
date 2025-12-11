import Link from "next/link";
import { compileMDX, type MDXRemoteProps } from "next-mdx-remote/rsc";
import { highlight } from "sugar-high";
import React, { AnchorHTMLAttributes, ImgHTMLAttributes } from "react";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

import { slugify } from "@/utils";
import { MDXComponents } from "mdx/types";
import { Quote } from "./quote";

type TableProps = {
  data: {
    headers: string[];
    rows: string[][];
  };
};

function Table({ data }: TableProps) {
  const headers = data.headers.map((header, index) => (
    <th key={index}>{header}</th>
  ));
  const rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ));
  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function CustomLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const href = props.href;

  if (href?.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    );
  }

  if (href?.startsWith("#")) {
    return <a {...props} />;
  }
  return <a target="_blank" rel="noopener noreferrer" {...props} />;
}

function RoundedImage({ alt, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <span className="w-full h-fit relative block mx-auto my-6">
      <img alt={alt} className="rounded-xl object-contain" {...props} />
    </span>
  );
}
type CodeProps = {
  children: string;
};

function Code({ children, ...props }: CodeProps) {
  const codeHTML = highlight(children);
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
}

function createHeading(level: number) {
  const Heading = ({ children }: { children: string }) => {
    const slug = slugify(children);
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement("a", {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: "anchor",
        }),
      ],
      children
    );
  };

  Heading.displayName = `Heading${level}`;

  return Heading;
}

const components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  img: RoundedImage,
  a: CustomLink,
  code: Code,
  table: Table,
  Quote,
};

export async function CustomMDX(props: MDXRemoteProps) {
  const source = await compileMDX({
    source: props.source,
    options: {
      mdxOptions: {
        rehypePlugins: [[rehypeKatex as any, { trust: true }]],
        remarkPlugins: [remarkMath],
        format: "mdx",
      },
    },
    components: { ...components, ...props.components } as MDXComponents,
  });

  return source.content;
}
