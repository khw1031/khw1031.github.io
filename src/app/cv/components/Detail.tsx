type DetailProps = {
  title: string;
  period: string;
  content: string[];
};

export function Detail({ title, period, content }: DetailProps) {
  return (
    <div className="font-noto_serif">
      <div className="flex items-center gap-2">
        <h3 className="text-md font-bold text-neutral-800">{title}</h3>
        <p className="text-[12px] font-semibold text-neutral-500">{period}</p>
      </div>
      <ul>
        {content.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
