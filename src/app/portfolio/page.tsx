import { CustomMDX } from "@/components/mdx";
import { readMDXFile } from "@/utils";
import { Metadata } from "next";
import { join } from "path";
import { Layout, Header, Section, Detail, Keywords } from "@/app/components/document";

export const metadata: Metadata = {
  title: "포트폴리오 - portfolio",
};

export default function Page() {
  const portfolioFile = readMDXFile(join(process.cwd(), "/src/app/portfolio/portfolio.mdx"));

  return (
    <section>
      <article className="cv">
        <CustomMDX
          source={portfolioFile.content}
          components={{ Layout, Header, Section, Detail, Keywords }}
        />
      </article>
    </section>
  );
}
