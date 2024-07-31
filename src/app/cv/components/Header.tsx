import { useEffect } from "react";

export function Header() {
  return (
    <>
      <div className="flex font-noto_serif items-end justify-between pb-8">
        <h1 className="text-neutral-800 text-md font-medium flex flex-col">
          <span>김 현 우</span>
          <span className="text-sm text-gray-500">Frontend Developer</span>
        </h1>
        <a href="mailto:khw1031@gmail.com" className="text-sm">
          Email: khw1031@gmail.com
        </a>
      </div>
    </>
  );
}
