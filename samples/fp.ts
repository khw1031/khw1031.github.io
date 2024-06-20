// # 홀수 n개를 뽑아서 n^2 값을 모두 더하기

function f1(limit: number, list: Iterable<number>) {
  return pipe(
    list,
    filter((n) => n % 2),
    map((n) => n * n),
    take(3),
    reduce((acc, n) => acc + n, 0),
  );
}

const result = f1(2, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
console.log(result);

function* filter<A, B = unknown>(f: (a: A) => B, iterable?: Iterable<A>) {
  if (iterable === undefined) {
    return (iterable: Iterable<A>) => filter(f, iterable);
  }
  for (const a of iterable) {
    if (f(a)) yield a;
  }
}

function* map<A, B = unknown>(f: (a: A) => B, iterable?: Iterable<A>) {
  if (iterable === undefined) {
    return (iterable: Iterable<A>) => map(f, iterable);
  }
  for (const a of iterable) {
    yield f(a);
  }
}

function* take<A>(length: number, iterable?: Iterable<A>) {
  if (iterable === undefined) {
    return (iterable: Iterable<A>) => take(length, iterable);
  }
  const iterator = iterable[Symbol.iterator]();
  let cur = null;
  while (length-- > 0 && (cur = iterator.next())) {
    yield cur.value;
  }
}

type SyncReducer<Acc, T> = (acc: Acc, value: T) => Acc;

function reduce<T, Acc>(
  f: SyncReducer<Acc, T>,
  acc: Acc | Iterable<T>,
  iterable?: Iterable<T>
): Acc {
  if (iterable === undefined) {
    return (iterable: Iterable<T>) => reduce(f, acc, iterable);
  }
  for (const a of iterable) {
    acc = f(acc as Acc, a);
  }
  return acc as Acc;
}

function pipe<T>(a: T, ...fns: any[]) {
  return reduce(
    (acc, f) => {
      if (f[Symbol.iterator] === undefined) {
        return f(acc as any);
      }
      const iter = f[Symbol.iterator]();
      const fn = iter.next().value;
      return fn(acc);
    },
    a,
    fns
  );
}
