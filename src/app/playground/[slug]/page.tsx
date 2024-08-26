import { notFound } from "next/navigation";

import { BlogPost } from "@/components";
import { getBlogPosts } from "@/utils";

export async function generateStaticParams() {
  const posts = getBlogPosts("/src/app/playground/posts");

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Blog({ params }: { params: { slug: string } }) {
  const post = getBlogPosts("/src/app/playground/posts").find(
    (post) => encodeURIComponent(post.slug) === params.slug
  );

  if (!post) {
    notFound();
  }

  return <BlogPost post={post} />;
}
