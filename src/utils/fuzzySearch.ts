export function fuzzySearch(needle: string, haystack: string): number {
  const pattern = needle.toLowerCase().split("");
  const text = haystack.toLowerCase();

  let score = 0;
  let lastIndex = -1;

  for (const char of pattern) {
    const index = text.indexOf(char, lastIndex + 1);
    if (index === -1) return 0;

    score += index === lastIndex + 1 ? 2 : 1;
    score += text[index - 1] === " " ? 1 : 0;

    lastIndex = index;
  }

  return score;
}
