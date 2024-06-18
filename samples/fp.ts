import {
  pipe,
  range,
  each,
  map,
  toArray,
  reject,
  reduce,
  take,
  split,
  tap,
  fromEntries,
  noop,
  filter,
} from "ffuunnccttiioonn";

const as = <T>(a: any) => a as T;

const users = [
  { id: 1, name: "John", age: 20 },
  { id: 2, name: "Jane", age: 25 },
  { id: 3, name: "Jim", age: 30 },
];

const user = users.find((user) => user.name === "Kim");
console.log(user);

pipe(
  users,
  filter((user) => user.name === "Kim"),
  take(1),
  each(console.log)
);
