function replaceLocal(string: string, regexp: RegExp, replacer: (...args: any[]) => Promise<string>): Promise<string> {
  const matched = string.match(regexp);
  if (!matched) return Promise.resolve(string);
  return replacer(...[
    ...matched,
    matched.index,
    matched.input
  ]).then((newString) => string.replace(regexp, newString));
}

/**
 * Asynchronously replaces substrings in a string using a regular expression and a replacer function.
 * 
 * @param string - The input string to perform replacements on.
 * @param regexp - The regular expression pattern to match against the string.
 * @param replacer - An async function that returns the replacement for each match.
 *                   It receives the same arguments as the callback for String.prototype.replace.
 * @returns A Promise that resolves to the new string with all replacements made.
 * 
 * @example
 * const result = await asyncReplace("abc123", /(\d+)/g, async (match, p1) => {
 *   return await someAsyncOperation(p1);
 * });
 */
export default function asyncReplace(
  string: string,
  regexp: RegExp,
  replacer: (...args: any[]) => Promise<string> = async () => ''
): Promise<string> {
  if (!regexp.global) return replaceLocal(string, regexp, replacer);

  const matched = string.match(regexp);

  if (!matched) {
    return Promise.resolve(string);
  }

  let i = 0;
  let index = 0;
  const result: string[] = [];
  const copy = new RegExp(regexp.source, regexp.flags.replace('g', ''));
  const callbacks: Promise<void>[] = [];
  
  while (matched.length > 0) {
    const subString = matched.shift()!;
    const nextIndex = string.indexOf(subString, index);
    result[i] = string.slice(index, nextIndex);
    i++;
    let j = i;
    callbacks.push(replacer(...[
      ...subString.match(copy)!,
      nextIndex,
      string
    ]).then(newString => {
      result[j] = newString;
    }));
    index = nextIndex + subString.length;
    i++;
  }
  result[i] = string.slice(index);
  return Promise.all(callbacks).then(() => result.join(''));
}
