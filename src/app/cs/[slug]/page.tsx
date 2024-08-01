import { CustomMDX } from "@/components/mdx";
import { formatDate, getBlogPosts } from "@/utils";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const posts = getBlogPosts("/src/app/cs/posts");

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Blog({ params }: { params: { slug: string } }) {
  const post = getBlogPosts("/src/app/cs/posts").find(
    (post) => encodeURIComponent(post.slug) === params.slug
  );

  if (!post) {
    notFound();
  }

  const updatedAtIsCreatedAt =
    post.metadata.publishedAt === post.metadata.updatedAt;

  return (
    <section>
      <header className="font-noto_serif mt-6 mb-8">
        <h1 className="font-semibold text-xl">{post.metadata.title}</h1>
        <p className="text-xs font-thin text-neutral-800 italic gap-1 flex">
          <span className={`${!updatedAtIsCreatedAt ? "line-through" : ""}`}>
            {formatDate(post.metadata.publishedAt, "en-US")}
          </span>
          {!updatedAtIsCreatedAt && (
            <span>{formatDate(post.metadata.updatedAt, "en-US")}</span>
          )}
        </p>
      </header>
      <article className="prose">
        <CustomMDX source={post.content} />
      </article>
    </section>
  );
}
