import { expectType } from 'tsd';

import {
  validate,
  date,
  number,
  oneOf,
  string,
  object,
  array,
  boolean,
  nullable,
  optional,
  nil,
  minArrayLength,
  minStringLength,
  unknown,
} from '../src';

// validators
const validator1 = string();
expectType<string>(validate(validator1)(''));

const validator2 = number();
expectType<number>(validate(validator2)(''));

const validator3 = date();
expectType<Date>(validate(validator3)(''));

const validator4 = oneOf(['a', 'b'])();
expectType<'a' | 'b'>(validate(validator4)('a'));

const validator41 = validate(oneOf([number(), false])())('');
expectType<number | false>(validator41);

const validator5 = nullable(string());
expectType<string | null>(validate(validator5)(''));

const validator6 = nullable(oneOf(['a'])());
expectType<'a' | null>(validate(validator6)(''));

const validator7 = optional(nullable(oneOf(['a'])()));
expectType<'a' | null | undefined>(validate(validator7)(''));

const validator8 = optional(nullable(boolean()));
expectType<boolean | null | undefined>(validate(validator8)(false));

const validator9 = nil(boolean());
expectType<boolean | null | undefined>(validate(validator9)(false));

// nested
const nested1 = object({})();
expectType<{}>(validate(nested1)({}));

const nested2 = object({
  a: string(),
  b: object({
    c: number(),
  })(),
})();
expectType<{ readonly a: string; readonly b: { readonly c: number } }>(validate(nested2)({}));

const nested3 = array();
expectType<readonly never[]>(validate(nested3())([]));

const nested4 = array(string());
expectType<readonly string[]>(validate(nested4())([]));

const nested5 = array(string(), optional(number()));
expectType<readonly (string | number | undefined)[]>(validate(nested5())([]));

const nested6 = optional(array(string(), number())());
expectType<readonly (string | number)[] | undefined>(validate(nested6)([]));

const nested7 = optional(
  object({
    arr: optional(array(string(), number())()),
  })(),
);
expectType<
  | {
      readonly arr?: readonly (string | number)[];
    }
  | undefined
>(validate(nested7)({}));

// parsed
const parsed1 = number();
expectType<number>(validate(parsed1)('1'));

const parsed2 = string();
expectType<string>(validate(parsed2)(new Date(0)));

const parsed3 = date();
expectType<Date>(validate(parsed3)('1970-01-01T00:00:00.000Z'));

// minArrayLength and minStringLength
const len1 = minArrayLength(1)(array(string())());
const resLen1 = validate(len1)([]);
expectType<readonly [string, ...(readonly string[])]>(resLen1);
expectType<string>(resLen1[0]);
expectType<string | undefined>(resLen1[1]);

const len10 = minArrayLength(10)(array(string())());
const resLen10 = validate(len10)([]);
expectType<
  readonly [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    ...(readonly string[])
  ]
>(resLen10);
expectType<string>(resLen10[0]);
expectType<string>(resLen10[1]);
expectType<string>(resLen10[2]);
expectType<string>(resLen10[3]);
expectType<string>(resLen10[4]);
expectType<string>(resLen10[5]);
expectType<string>(resLen10[6]);
expectType<string>(resLen10[7]);
expectType<string>(resLen10[8]);
expectType<string>(resLen10[9]);
expectType<string | undefined>(resLen10[10]);
expectType<string | undefined>(resLen10[11]);

const nonEmptyArr = validate(minArrayLength(1)(array(string())()))('');
expectType<readonly [string, ...(readonly string[])]>(nonEmptyArr);

const nonEmptyStr1 = validate(minStringLength(1)(string()))('');
expectType<string>(nonEmptyStr1);

const nonEmptyStr2 = validate(minStringLength(10)(string()))('');
expectType<string>(nonEmptyStr2);

const personSchema = object({
  name: string(),
  age: number(),
  email: optional(string()),
})();

expectType<{
  readonly name: string;
  readonly age: number;
  readonly email?: string | undefined;
}>(
  validate(personSchema)({
    name: 'Mark',
    age: 29,
  }),
);

expectType<unknown>(validate(unknown())('dsdas'));

expectType<{ readonly a: number; readonly b: string; readonly c?: unknown }>(
  validate(
    object({
      a: number(),
      b: string(),
      c: unknown(),
    })(),
  )('dsdas'),
);
