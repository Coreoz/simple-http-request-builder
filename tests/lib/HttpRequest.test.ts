// if someone find out how to use @types/jest and avoid this, please make a PR...
import { describe, expect, test } from '@jest/globals';
import { HttpMethod, HttpRequest } from '../../src';

describe('HttpUrl', () => {

  test('Verify that a URL without query params is correctly build', () => {
    const httpRequest = new HttpRequest(() => ({}), 'https://google.com/api', HttpMethod.GET, '/test');
    expect(httpRequest.buildUrl()).toBe('https://google.com/api/test');
  });

  test('Verify that the hostname can be changed in the request', () => {
    const httpRequest = new HttpRequest(() => ({}), 'https://google.com/api', HttpMethod.GET, '/test');
    httpRequest.hostname('coreoz.com')
    expect(httpRequest.buildUrl()).toBe('https://coreoz.com/api/test');
  });

});
