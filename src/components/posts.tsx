import { formatDate, getBlogPosts, isProd } from "@/utils";
import Link from "next/link";

type Props = {
  postPath: string;
  postDir: string;
};

export function BlogPosts({ postPath, postDir }: Props) {
  const allBlogs = getBlogPosts(postPath);

  return (
    <div>
      {allBlogs
        .filter((post) => !isProd || !post.metadata.wip)
        .sort((a, b) => {
          const prevDate = a.metadata?.updatedAt ?? a.metadata.publishedAt;
          const nextDate = b.metadata?.updatedAt ?? b.metadata.publishedAt;

          return new Date(prevDate) > new Date(nextDate) ? -1 : 1;
        })
        .map((post) => (
          <Link
            key={post.slug}
            className="flex flex-col space-y-1 mb-4"
            href={`/${postDir}/${post.slug}`}
          >
            <div className="w-full flex md:flex-row flex-col space-x-0 md:space-x-2">
              <p className="text-neutral-900 tracking-tight">
                {!isProd && post.metadata.wip && (
                  <span className="mr-1">🚧</span>
                )}
                {post.metadata.title}
              </p>
              <p className="text-neutral-600 font-thin w-[100px] tabular-nums text-xs md:self-end self-start pb-0.5">
                {formatDate(post.metadata.publishedAt, "en-US", false)}
              </p>
            </div>
          </Link>
        ))}
    </div>
  );
}
