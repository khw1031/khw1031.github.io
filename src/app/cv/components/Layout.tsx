"use client";
import { Margin, usePDF } from "react-to-pdf";

const Corner = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="10"
      viewBox="0 0 24 24"
      strokeWidth="0.5"
      stroke="rgb(38 38 38 / 1)"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M4 20v-15a1 1 0 0 1 1 -1h15" />
    </svg>
  );
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { toPDF, targetRef } = usePDF({
    filename: "김현우_프론트엔드개발자.pdf",
    page: {
      margin: Margin.MEDIUM,
    },
  });

  return (
    <div className="cv-layout mt-10 mx-auto max-w-full flex flex-col justify-between relative px-8 py-16 bg-zinc-100">
      <div className="absolute top-2 left-2">
        <Corner />
      </div>
      <div className="absolute top-2 left-2 rotate-180">
        <Corner />
      </div>
      <div className="absolute bottom-2 right-2">
        <Corner />
      </div>
      <div className="absolute bottom-2 right-2 rotate-180">
        <Corner />
      </div>
      <button
        id="button"
        className="w-fit self-end px-3 bg-zinc-700 rounded-md flex items-center justify-center mb-4"
        onClick={() => toPDF()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-pdf"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="#fff"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M10 8v8h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-2z" />
          <path d="M3 12h2a2 2 0 1 0 0 -4h-2v8" />
          <path d="M17 12h3" />
          <path d="M21 8h-4v8" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-download mb-0.5"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="#fff"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
          <path d="M7 11l5 5l5 -5" />
          <path d="M12 4l0 12" />
        </svg>
      </button>
      <div ref={targetRef}>{children}</div>
    </div>
  );
}
