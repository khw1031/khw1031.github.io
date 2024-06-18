import { CustomMDX } from "@/components/mdx";
import { formatDate, getBlogPosts, isProd } from "@/utils";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const posts = getBlogPosts("/src/app/log/posts");

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Blog({ params }: { params: { slug: string } }) {
  const post = getBlogPosts("/src/app/log/posts").find(
    (post) => encodeURIComponent(post.slug) === params.slug
  );

  if (!post) {
    notFound();
  }

  return (
    <section>
      <h1 className="title font-bold text-lg md:text-2xl tracking-tighter">
        {!isProd && post.metadata.wip && <span className="mr-1">🚧</span>}
        {post.metadata.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm">
        <p className="text-xs text-neutral-800">
          {formatDate(post.metadata.publishedAt, "ko-KR", true)}
        </p>
      </div>
      <article className="prose">
        <CustomMDX source={post.content} />
      </article>
    </section>
  );
}
