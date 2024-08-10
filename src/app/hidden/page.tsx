import { Navbar, PageMain } from "@/components";
import { getBlogPosts } from "@/utils";

export default function Page() {
  const postDir = __dirname.split("/").slice(-1)[0];
  const postsLength = getBlogPosts(`/src/app/${postDir}/posts`).length;

  return (
    <div>
      <Navbar
        items={{
          "/cs": { name: "CS" },
          "/log": { name: "Log" },
          "/notes": { name: "Notes" },
        }}
      />
      <PageMain
        postDir={postDir}
        postsLength={postsLength}
        postPath={`/src/app/${postDir}/posts`}
      />
    </div>
  );
}
