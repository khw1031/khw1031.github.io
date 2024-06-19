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

(async () => {
  const file = getFile("file1.png");

  const result = await Promise.race([file, delay(2000, "SHOW_LOADER")]);

  switch (result) {
    case "SHOW_LOADER":
      console.log("SHOW_LOADER");

      break;
    default:
      console.log(result);
  }
})();
