export const StatusCode = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  SERVER_ERROR: 500,
  CLIENT_ERROR: 400,
  AUTHENTICATION: 401,
  CONFLICT: 409,
  NOT_FOUND: 404,
} as const;
export type StatusCode = (typeof StatusCode)[keyof typeof StatusCode];
