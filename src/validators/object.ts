/* eslint-disable functional/no-loop-statement */

import { refine } from '../refine';
import { schemaToString, objectToPrint, quote } from '../stringify';

import type { SomeSchema, TypeOf, ErrorDataEntry } from '../types';
import type { UndefinedToOptional } from '@typeofweb/utils';

export interface ObjectSchemaOptions {
  readonly allowUnknownKeys?: boolean;
}

export const object = <U extends Record<string, SomeSchema<any>>>(
  schemasObject: U,
  options?: ObjectSchemaOptions,
) => {
  type TypeOfResult = UndefinedToOptional<
    {
      readonly [K in keyof U]: TypeOf<U[K]>;
    }
  >;

  return refine(
    function (obj, t) {
      if (typeof obj !== 'object' || obj === null) {
        return t.left({
          expected: 'object',
          got: obj,
        });
      }
      const object = obj as Record<string, unknown>;

      const validators = schemasObject as Record<string, SomeSchema<any>>;
      const allowUnknownKeys = !!options?.allowUnknownKeys;

      // eslint-disable-next-line functional/prefer-readonly-type
      const errors: Array<ErrorDataEntry> = [];

      let isError = false;
      const result = {} as Record<string, unknown>;
      for (const key in object) {
        if (!Object.prototype.hasOwnProperty.call(object, key)) {
          continue;
        }
        const value = object[key];

        const validator = validators[key];
        if (validator) {
          const r = validator.__validate(value);
          result[key] = r.value;
          if (r._t === 'left') {
            errors.push({
              path: key,
              error: r.value,
            });
            isError = true;
          }
          continue;
        } else {
          if (allowUnknownKeys) {
            result[key] = value;
            continue;
          } else {
            isError = true;
            errors.push({
              path: key,
              error: {
                expected: 'unknownKey',
                got: value,
              },
            });
            continue;
          }
        }
      }

      for (const key in validators) {
        if (!Object.prototype.hasOwnProperty.call(validators, key)) {
          continue;
        }
        if (key in result) {
          continue;
        }
        const validator = validators[key]!;
        const value = object[key];
        const r = validator.__validate(value);
        if (r._t === 'left') {
          errors.push({ path: key, error: r.value });
          isError = true;
        }
      }

      if (isError) {
        return t.left({
          expected: 'object',
          got: obj,
          errors,
        });
      }
      return t.nextValid(result as TypeOfResult);
    },
    () => {
      const entries = Object.entries(schemasObject).map(
        ([key, val]) => [key, schemaToString(val)] as const,
      );
      if (entries.length === 0) {
        return objectToPrint('');
      }
      return objectToPrint(
        ' ' + entries.map(([key, val]) => quote(key) + ': ' + val).join(', ') + ' ',
      );
    },
  );
};
