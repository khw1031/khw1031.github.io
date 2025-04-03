import Link from "next/link";

const navItems = {
  "/": {
    name: "HOME",
  },
  // "/read-and-write": {
  //   name: "READ & WRITE",
  // },
  // "/playground": {
  //   name: "PLAYGROUND",
  // },
  "/cv": {
    name: "CV",
  },
};

type Props = {
  items?: Record<string, { name: string }>;
};
export function Navbar({ items = navItems }: Props) {
  return (
    <aside className="-ml-[8px] mb-4 tracking-tight pb-2 border-b border-neutral-200">
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex flex-row items-start relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
          id="nav"
        >
          <div className="flex flex-row space-x-0 pr-10">
            {Object.entries(items).map(([path, { name }]) => {
              return (
                <Link
                  key={path}
                  href={path}
                  className="text-xs font-bold font-serif transition-all hover:text-neutral-950 self-center relative py-1 px-1.5 m-1"
                >
                  {name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </aside>
  );
}
