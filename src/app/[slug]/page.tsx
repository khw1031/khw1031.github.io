import { notFound } from "next/navigation";

import { getBlogPosts } from "@/utils";
import { BlogPost } from "@/components";

export async function generateStaticParams() {
  const posts = getBlogPosts("/src/app/posts");

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Blog({ params }: { params: { slug: string } }) {
  const post = getBlogPosts("/src/app/posts").find(
    (post) => encodeURIComponent(post.slug) === params.slug
  );

  if (!post) {
    notFound();
  }

  return <BlogPost post={post} />;
}
