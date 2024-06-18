import { readdirSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { read } from "gray-matter";

type Metadata = {
  title: string;
  publishedAt: string;
  wip?: boolean;
  updatedAt?: string;
  summary: string;
  image?: string;
};

export const isProd = process.env.NODE_ENV === "production";

export const cx = (...classes: string[]) => classes.filter(Boolean).join(" ");

function getMDXFiles(dir: string, mdxFiles: string[] = [], path = "") {
  readdirSync(dir).forEach((file) => {
    if (extname(file) === ".mdx") {
      mdxFiles.push(join(path, file));
    }
    if (extname(file) === "") {
      getMDXFiles(join(dir, file), mdxFiles, join(path, file));
    }
  });

  return mdxFiles;
}

function readMDXFile(filePath: string) {
  return read(filePath);
}

function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir);

  return mdxFiles.map((file) => {
    const { data, content } = readMDXFile(join(dir, file));
    const slug = slugify(basename(file, extname(file)));

    return {
      metadata: data as Metadata,
      slug,
      content,
    };
  });
}

export function slugify(str: string) {
  if (!str) return "";
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w\-ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+/g, "")
    .replace(/\-\-+/g, "-");
}

export function getBlogPosts(path: string) {
  return getMDXData(join(process.cwd(), path));
}

export function formatDate(
  date: string,
  locale = "ko-KR",
  includeRelative = false
) {
  const currentDate = new Date();
  if (!date.includes("T")) {
    date = `${date}T00:00:00`;
  }
  const targetDate = new Date(date);

  const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  const monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  const daysAgo = currentDate.getDate() - targetDate.getDate();

  let formattedDate = "";

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}년 전`;
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}달 전`;
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}일 전`;
  } else {
    formattedDate = "오늘";
  }

  const fullDate = targetDate.toLocaleString(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (!includeRelative) {
    return fullDate;
  }

  return `${fullDate} (${formattedDate})`;
}
