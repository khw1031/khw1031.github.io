import { CustomMDX } from "@/components/mdx";
import { readMDXFile } from "@/utils";
import { Metadata } from "next";
import { join } from "path";
import { Layout, Header, Section, Detail, Keywords } from "@/app/components/document";

export const metadata: Metadata = {
  title: "자기소개서 - cover letter",
};

export default function Page() {
  const coverLetterFile = readMDXFile(join(process.cwd(), "/src/app/cover-letter/cover-letter.mdx"));

  return (
    <section>
      <article className="cv">
        <CustomMDX
          source={coverLetterFile.content}
          components={{ Layout, Header, Section, Detail, Keywords }}
        />
      </article>
    </section>
  );
}
