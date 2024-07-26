import { CustomMDX } from "@/components/mdx";
import { readMDXFile } from "@/utils";
import { Metadata } from "next";
import { join } from "path";

export const metadata: Metadata = {
  title: "이력서 - cv",
};

export default function Page() {
  const cvFile = readMDXFile(join(process.cwd(), "/src/app/cv/cv.mdx"));

  return (
    <section>
      <article className="prose">
        <CustomMDX source={cvFile.content} />
      </article>
    </section>
  );
}
