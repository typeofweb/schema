/* eslint-disable functional/no-this-expression */
import { ValidationError } from '../errors';
import type { Schema } from '../types';
import { isDate, isISODateString } from '../utils';

import { initialModifiers } from './__schema';
import { typeToPrint } from './__stringifyHelpers';
import { __validate } from './__validate';

export const date = () => {
  return {
    __modifiers: initialModifiers,
    toString() {
      return typeToPrint('Date');
    },
    __parse(value) {
      if (typeof value === 'string' && isISODateString(value)) {
        return new Date(value);
      }
      return value;
    },
    __validate(schema, value) {
      if (!isDate(value) || Number.isNaN(Number(value))) {
        return { _t: 'left', value: new ValidationError(schema, value) };
      }
      return { _t: 'right', value };
    },
  } as Schema<Date, typeof initialModifiers, never>;
};
