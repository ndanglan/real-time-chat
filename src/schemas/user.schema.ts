import { object, string, TypeOf } from 'zod';

export const tokenUserSchema = object({
  body: object({
    idToken: string({ required_error: 'idToken is required' }),
  }),
});

export const loginUserSchema = object({
  body: object({
    idToken: string({ required_error: 'idToken is required' }),
  }),
});

export type TokenUserInput = TypeOf<typeof tokenUserSchema>['body'];