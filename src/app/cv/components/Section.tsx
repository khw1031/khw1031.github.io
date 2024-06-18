type SectionProps = {
  title: string;
  children: React.ReactNode;
};

export function Section({ title, children }: SectionProps) {
  return (
    <div className="flex flex-col mt-8">
      <h2 className="text-sm w-fit font-semibold font-noto_serif text-neutral-700">
        {title}
      </h2>
      <hr className="w-full mt-1 mb-2 border-neutral-400" />
      <div className="flex flex-col py-4 gap-6">{children}</div>
    </div>
  );
}
