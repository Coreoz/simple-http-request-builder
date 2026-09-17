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
export type HttpMethod = typeof HttpMethod[keyof typeof HttpMethod];
