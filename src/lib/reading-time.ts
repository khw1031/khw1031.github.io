export interface ReadingTimeOptions {
  wordsPerMinute?: number;
}

export interface ReadingTimeResult {
  minutes: number;
  words: number;
}

export function readingTime(text: string, options: ReadingTimeOptions = {}): ReadingTimeResult {
  const wordsPerMinute = options.wordsPerMinute ?? 200;
  const trimmed = text.trim();
  const words = trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length;
  const minutes = words === 0 ? 0 : Math.ceil(words / wordsPerMinute);
  return { minutes, words };
}
