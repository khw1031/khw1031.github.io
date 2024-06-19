type Head<T extends any[]> = T extends [infer F, ...any[]] ? F : undefined;

type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;

declare function check<X, Y>(params: Equals<Equals<X, Y>, true>): void;

check<Head<[1, 2, 3]>, 1>(true);
check<Head<[1]>, 1>(true);
check<Head<[]>, undefined>(true);

type Length<T extends any[] | string, P extends any[] = []> = T extends any[]
  ? T["length"]
  : T extends `${T[0]}${infer A}`
  ? Length<A, Append<P, any>>
  : Length<P>;

check<Length<[1, 2, 3]>, 3>(true);

check<Length<"abcd">, 4>(true);

type HasTail<T extends any[]> = Length<T> extends 0 ? false : true;

check<HasTail<[1, 2, 3]>, true>(true);
check<HasTail<[3]>, true>(true);
check<HasTail<[]>, false>(true);

type Tail<T extends any[]> = T extends [infer _, ...infer R] ? R : [];

check<Tail<[1, 2, 3]>, [2, 3]>(true);
check<Tail<[1, 2, 3]>, [3]>(false);
check<Tail<[]>, []>(true);

type Last<T extends any[]> = T extends [...infer _, infer L] ? L : undefined;

check<Last<[1, 2, 3]>, 3>(true);
check<Last<[1]>, 1>(true);
check<Last<[]>, undefined>(true);

type Prepend<T extends any[], E> = [E, ...T];

check<Prepend<[], 1>, [1]>(true);
check<Prepend<[2, 3], 1>, [1, 2, 3]>(true);

type Drop<N, T extends any[], P extends any[] = []> = {
  0: T;
  1: Drop<N, Tail<T>, Prepend<P, any>>;
}[Length<P> extends N ? 0 : 1];

check<Drop<3, [1, 2, 3, 4]>, [4]>(true);
check<Drop<0, [1, 2, 3, 4]>, [1, 2, 3, 4]>(true);

type Reverse<T extends any[], P extends any[] = []> = {
  0: P;
  1: Reverse<Tail<T>, Prepend<P, Head<T>>>;
}[Length<T> extends 0 ? 0 : 1];

check<Reverse<[1, 2, 3]>, [3, 2, 1]>(true);
check<Reverse<[1]>, [1]>(true);
check<Reverse<[]>, []>(true);

type Concat<T extends any[], U extends any[]> = [...T, ...U];

check<Concat<[1, 2, 3], [4, 5, 6]>, [1, 2, 3, 4, 5, 6]>(true);
check<Concat<[1, 2, 3], [4]>, [1, 2, 3, 4]>(true);

type Append<T extends any[], E> = Concat<T, [E]>;

check<Append<[1, 2, 3], 4>, [1, 2, 3, 4]>(true);

type Join<T extends any[], S extends string> = Length<T> extends 0
  ? ""
  : Length<T> extends 1
  ? `${T[0]}`
  : `${T[0]}${S}${Join<Tail<T>, S>}`;

check<Join<[1, 2, 3], "-">, "1-2-3">(true);
check<Join<[1], "-">, "1">(true);
check<Join<[], "-">, "">(true);

type Replace<
  S extends string,
  T extends string,
  R extends string
> = S extends `${infer P1}${T}${infer P2}`
  ? Replace<`${P1}${R}${P2}`, T, R>
  : S;

check<Replace<"abcdafg", "a", "A">, "AbcdAfg">(true);
check<Replace<"abcdefg", "b", "B">, "aBcdefg">(true);

type Split<
  T extends string,
  S extends string,
  P extends any[] = []
> = T extends `${infer P1}${S}${infer P2}`
  ? Split<P2, S, Append<P, P1>>
  : Append<P, T>;

check<Split<"asd,f,fd,dfasd", ",">, ["asd", "f", "fd", "dfasd"]>(true);

type Flat<T, Depth extends number = 1> = {
  done: T;
  recur: T extends Array<infer A>
    ? Flat<A, [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10][Depth]>
    : T;
}[Depth extends -1 ? "done" : "recur"];

check<Flat<[1, 2, 3, [4]]>, 1 | 2 | 3 | 4>(true);
check<Flat<[1, 2, 3, [[4]]], 1>, 1 | 2 | 3 | [4]>(true);
check<Flat<[1, 2, 3, [[4]]], 2>, 1 | 2 | 3 | 4>(true);

type Add<N1, N2> = never;

