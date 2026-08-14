import type { ParsedFormValue } from 'hono/types';

export type FormValues<T> = {
  [P in keyof T]: ParsedFormValue | ParsedFormValue[];
};
