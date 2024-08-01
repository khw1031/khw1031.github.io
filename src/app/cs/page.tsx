import { BlogPosts } from "@/components/posts";
import { getBlogPosts } from "@/utils";

export default function Page() {
  const postDir = __dirname.split("/").slice(-1)[0];

  const postsLength = getBlogPosts(`/src/app/${postDir}/posts`).filter(
    (post) => !post.metadata.wip
  ).length;
  return (
    <section>
      <h1 className="font-semibold text-xl mt-6 mb-8 tracking-tight font-noto_serif">
        Posts <span className="text-sm font-normal">(총 {postsLength}개)</span>
      </h1>
      <BlogPosts postDir={postDir} postPath={`/src/app/${postDir}/posts`} />
    </section>
  );
}
