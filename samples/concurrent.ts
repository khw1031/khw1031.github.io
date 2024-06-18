function delay<T>(time: number, value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value);
    }, time);
  });
}

type FileType = {
  name: string;
  body: string;
  size: number;
};

function getFile(name: string): Promise<FileType> {
  return delay(1000, { name, body: "...", size: 100 });
}

function* take<T>(length: number, iterable: Iterable<T>) {
  const iterator = iterable[Symbol.iterator]();
  while (length-- > 0) {
    const { value, done } = iterator.next();
    if (done) break;
    yield value;
  }
}

function* chunk<T>(size: number, iterable: Iterable<T>) {
  const iterator = iterable[Symbol.iterator]();
  while (true) {
    const arr = [...take(size, { [Symbol.iterator]: () => iterator })];
    if (arr.length) yield arr;
    if (arr.length < size) break;
  }
}

function* map<T, P>(
  fn: (a: T) => P,
  iterable: Iterable<T>
): IterableIterator<P> {
  for (const value of iterable) {
    yield fn(value);
  }
}

async function fromAsync<T>(
  iterable: Iterable<Promise<T>>
): Promise<Awaited<T>[]> {
  const arr: Awaited<T>[] = [];
  for await (const value of iterable) {
    arr.push(value);
  }
  return arr;
}

class FxIterator<T> {
  constructor(public iterable: Iterable<T>) {}

  chunk(size: number) {
    return new FxIterator(chunk(size, this.iterable));
  }

  map<U>(f: (a: T) => U): FxIterator<U> {
    return new FxIterator(map(f, this.iterable));
  }

  to<U>(f: (iterable: Iterable<T>) => U): U {
    return f(this.iterable);
  }
}

function fx<T>(iterable: Iterable<T>): FxIterator<T> {
  return new FxIterator(iterable);
}

(async () => {
  const concurrent = async <T>(limit: number, fs: (() => Promise<T>)[]) => {
    return fx(fs)
      .chunk(limit)
      .map((fs) => fs.map((f) => f()))
      .map((ps) => Promise.all(ps))
      .to(fromAsync)
      .then((arr) => arr.flat());
  };

  console.time();
  const files = await concurrent(2, [
    () => getFile("file1.png"),
    () => getFile("file2.png"),
    () => getFile("file3.png"),
    () => getFile("file4.png"),
    () => getFile("file5.png"),
    () => getFile("file6.png"),
    () => getFile("file7.png"),
  ]);

  console.log(files);
  console.timeEnd();
})();
