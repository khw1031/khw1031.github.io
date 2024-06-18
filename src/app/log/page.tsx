import { BlogPosts } from "@/components/posts";
import { getBlogPosts } from "@/utils";

export const metadata = {
  title: "Blog",
  description: "Read my blog.",
};

export default function Page() {
  const postsLength = getBlogPosts("/src/app/log/posts").filter(
    (post) => !post.metadata.wip
  ).length;
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">
        Posts <span className="text-sm font-normal">(총 {postsLength}개)</span>
      </h1>
      <BlogPosts postDir="log" postPath="/src/app/log/posts" />
    </section>
  );
}
