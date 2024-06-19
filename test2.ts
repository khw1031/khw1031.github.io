check<Awaited<Promise<number> | Promise<boolean>>, number | boolean>(true);
check<Awaited<Promise<Promise<number>>>, number>(true);

check<Partial<{ a: number; b: string }>, { a?: number; b?: string }>(true);

check<Required<{ a?: number; b?: string }>, { a: number; b: string }>(true);

check<
  Readonly<{ a: number; b: string }>,
  { readonly a: number; readonly b: string }
>(true);

check<Record<"a" | "b" | "c", number>, { a: number; b: number; c: number }>(
  true
);
