import Link from "next/link";
import React from "react";

type QuoteProps = {
  url?: string;
  children: React.ReactNode;
};

export function Quote({ url, children }: QuoteProps) {
  return (
    <div className="my-6 rounded-xl border border-neutral-200 bg-neutral-50 px-6 py-5 dark:border-neutral-800 dark:bg-neutral-900">
      {url && (
        <div className="mb-4 flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate hover:text-neutral-800 hover:underline dark:hover:text-neutral-200"
          >
            {url}
          </Link>
        </div>
      )}
      <div className="whitespace-pre-wrap leading-relaxed text-neutral-700 dark:text-neutral-300">
        {children}
      </div>
    </div>
  );
}
