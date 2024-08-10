import { PageMain } from "@/components";
import { getBlogPosts } from "@/utils";

export default function Page() {
  const postDir = __dirname.split("/").slice(-1)[0];
  const postsLength = getBlogPosts(`/src/app/${postDir}/posts`).length;

  return (
    <PageMain
      postDir={postDir}
      postsLength={postsLength}
      postPath={`/src/app/${postDir}/posts`}
    />
  );
}
