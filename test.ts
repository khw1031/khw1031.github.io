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

type Length<T extends any[]> = T["length"];

check<Length<[1, 2, 3]>, 3>(true);
