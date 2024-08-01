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
            className="flex items-center font-noto_serif mb-2 gap-2 relative"
            href={`/${postDir}/${post.slug}`}
          >
            <p className="text-neutral-800 text-[16px] font-semibold ml-4">
              {post.metadata.title}
            </p>
            <p className="text-neutral-800 font-thin w-[100px] tabular-nums text-[12px] italic">
              {formatDate(post.metadata.publishedAt, "en-US")}
            </p>
            <span className="absolute left-0 top-0 bottom-0 my-auto w-1 h-1 bg-slate-800" />
          </Link>
        ))}
    </div>
  );
}
