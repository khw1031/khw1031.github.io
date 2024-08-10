import { PageMain } from "@/components";
import { getBlogPosts } from "@/utils";

export default function Page() {
  const postDir = __dirname.split("/").slice(-1)[0];
  const postsLength = getBlogPosts(`/src/${postDir}/posts`).length;

  return (
    <PageMain
      postDir={postDir}
      postsLength={postsLength}
      postPath={`/src/${postDir}/posts`}
      isRoot
    />
  );
}
