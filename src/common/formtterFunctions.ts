import { ValueTransformer } from 'typeorm';

function applyIfDefined<T, R>(
  value: T | null | undefined,
  fn: (val: T) => R,
): R | null {
  if (value === null || value === undefined) {
    return null;
  }
  return fn(value);
}

export const dateTransformer: ValueTransformer = {
  to: (value: Date) => value,
  from: (value: string | null) => applyIfDefined(value, (val) => new Date(val)),
};
