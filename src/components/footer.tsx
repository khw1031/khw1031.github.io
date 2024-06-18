function ArrowIcon() {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 mb-8">
      <ul className="font-sm mt-8 flex flex-col space-x-0 space-y-2 text-neutral-600 md:flex-row md:space-x-4 md:space-y-0">
        <li>
          <a
            className="flex items-center transition-all hover:text-neutral-800"
            rel="noopener noreferrer"
            target="_blank"
            href="/rss"
          >
            <ArrowIcon />
            <p className="ml-1.5 h-7">rss</p>
          </a>
        </li>
      </ul>
      <p className="text-neutral-600 text-sm flex justify-between">
        © {new Date().getFullYear()} MIT Licensed
        <span>♠</span>
      </p>
    </footer>
  );
}
