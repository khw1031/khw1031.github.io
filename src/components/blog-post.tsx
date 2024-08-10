import { formatDate, Metadata } from "@/utils";
import { CustomMDX } from "./mdx";

type Props = {
  post: {
    metadata: Metadata;
    slug: string;
    content: string;
  };
};

export function BlogPost({ post }: Props) {
  return (
    <section className="pt-8 pb-8">
      <h1 className="title font-[600] font-noto_serif text-[16px] md:text-[24px] tracking-tight">
        {post.metadata.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm">
        <p className="text-xs text-neutral-600">
          {formatDate(post.metadata.publishedAt, "ko-KR", true)}
        </p>
      </div>
      <article className="prose">
        <CustomMDX source={post.content} />
      </article>
    </section>
  );
}
