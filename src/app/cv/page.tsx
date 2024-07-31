import { CustomMDX } from "@/components/mdx";
import { readMDXFile } from "@/utils";
import { Metadata } from "next";
import { join } from "path";
import { Layout, Header, Section, Detail } from "./components";

export const metadata: Metadata = {
  title: "이력서 - cv",
};

export default function Page() {
  const cvFile = readMDXFile(join(process.cwd(), "/src/app/cv/cv.mdx"));

  return (
    <section>
      <article className="cv">
        <CustomMDX
          source={cvFile.content}
          components={{ Layout, Header, Section, Detail }}
        />
      </article>
    </section>
  );
}
