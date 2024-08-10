import { PostTitle } from "./post-title";
import { BlogPosts } from "./posts";

import { getBlogPosts } from "@/utils";

type Props = {
  postDir: string;
  postsLength: number;
  postPath: string;
  isRoot?: boolean;
};

export function PageMain({ postDir, postsLength, postPath, isRoot }: Props) {
  return (
    <main>
      <PostTitle length={postsLength} />
      <BlogPosts postDir={postDir} postPath={postPath} isRoot={isRoot} />
    </main>
  );
}
