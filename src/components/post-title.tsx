type Props = {
  length: number;
};

export function PostTitle({ length }: Props) {
  return (
    <h1 className="font-semibold text-2xl mt-8 mb-8 tracking-tight font-noto_serif">
      Posts <span className="text-sm font-normal">(총 {length}개)</span>
    </h1>
  );
}
