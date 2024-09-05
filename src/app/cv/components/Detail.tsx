type Content = {
  title: string;
  description: string[];
};

type DetailProps = {
  title: string;
  period: string;
  content?: Content[];
  url?: string;
  ect?: string;
};

export function Detail({ title, period, url, content = [], ect }: DetailProps) {
  return (
    <div className="font-noto_serif">
      <div className="flex items-center gap-1">
        <h3 className="text-md font-bold text-neutral-800">
          {url ? (
            <a
              href={url}
              className="underline text-blue-700 hover:text-blue-900"
              target="_blank"
              rel="noreferrer noopener"
            >
              {title}
            </a>
          ) : (
            title
          )}
        </h3>
        <p className="text-[12px] font-semibold text-neutral-600">{period}</p>
        {ect && (
          <span className="text-[10px] ml-1 text-neutral-500">
            <span className="mx-1">※</span>
            {ect}
          </span>
        )}
      </div>
      <div className="mt-1 flex flex-col gap-3">
        {content.map((item) => (
          <div key={item.title} className="ml-2">
            <h4 className="text-[14px] font-[500] text-neutral-800">
              {item.title}
            </h4>
            <ul className="flex flex-col text-neutral-600 gap-0.5 mt-0.5">
              {item.description?.map((description) => (
                <li
                  key={description}
                  className="ml-3 pl-2 relative text-[12px] font-[500]"
                >
                  {description}
                  <span className="absolute left-0 top-0 bottom-0 m-auto w-[2px] h-[2px] bg-neutral-800" />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
