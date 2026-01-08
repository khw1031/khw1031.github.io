import { useEffect } from "react";

export function Header() {
  return (
    <>
      <div className="flex font-noto_serif items-end justify-between pb-8">
        <h1 className="text-neutral-800 text-md font-medium flex flex-col">
          <span>김 현 우</span>
          <span className="text-sm text-gray-500">
            Frontend Based Product Developer
          </span>
        </h1>
        <div className="flex flex-col items-end">
          <a href="mailto:khw1031@gmail.com" className="text-sm">
            Email: khw1031@gmail.com
          </a>
          <a
            target="_blank"
            rel="noreferrer noopener"
            href="https://github.com/khw1031"
            className="text-sm"
          >
            Github: https://github.com/khw1031
          </a>
        </div>
      </div>
    </>
  );
}
