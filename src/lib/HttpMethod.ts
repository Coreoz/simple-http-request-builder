/**
 * Represent an HTTP method.
 */
export const HttpMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type HttpMethod = typeof HttpMethod[keyof typeof HttpMethod];
