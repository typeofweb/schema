import type { SomeSchema } from './types';

export const schemaToString = (schema?: SomeSchema<any>): string => {
  const strs = [schema?.toString()].flat().filter((x): x is string => typeof x !== 'undefined');
  return strs.length === 0 ? '' : strs.reduce((acc, val) => `${val}(${acc})`);
};

export const typeToPrint = (str: string) => str;
export const objectToPrint = (str: string) => '{' + str + '}';
export const quote = (str: string) => (/\s/.test(str) ? `"${str}"` : str);

export const unionToPrint = (arr: readonly (string | undefined)[]): string => {
  const filteredArray = arr.filter((x): x is string => typeof x !== 'undefined');
  const str = filteredArray.join(' | ');

  if (filteredArray.length > 1) {
    return `(${str})`;
  }
  return str;
};

declare global {
  interface Array<T> {
    includes(searchElement: unknown, fromIndex?: number): searchElement is T;
  }

  interface ReadonlyArray<T> {
    includes(searchElement: unknown, fromIndex?: number): searchElement is T;
  }
}
