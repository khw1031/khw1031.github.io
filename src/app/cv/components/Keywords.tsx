type Keyword = {
  name: string;
  color?: string;
};

type Props = {
  keywords: Keyword[];
};

export function Keywords({ keywords }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {keywords.map(({ name, color = "bg-neutral-400" }) => (
        <span
          key={name}
          className={`border border-neutral-500 text-[12px] inline-block rounded-sm px-2.5 py-1.5 font-medium text-neutral-50 ${color}`}
        >
          {name}
        </span>
      ))}
    </div>
  );
}
