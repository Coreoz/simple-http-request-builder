import { describe, expect, test } from 'vitest';
import { HttpMethod, MultipartHttpRequest } from '../../src';

describe('MultipartHttpRequest', () => {

  test('Verify that default options are applied', () => {
    const request = new MultipartHttpRequest(() => ({}), 'https://google.com/api', HttpMethod.POST, '/upload');
    expect(request.optionValues.timeoutInMillis).toBe(60_000);
    expect(request.optionValues.withCredentials).toBe(false);
    expect(request.optionValues.onProgressCallback).toBeTypeOf('function');
  });

  test('Verify that custom options are applied', () => {
    const onProgressCallback = () => {};
    const request = new MultipartHttpRequest(
      () => ({}),
      'https://google.com/api',
      HttpMethod.POST,
      '/upload',
      { timeoutInMillis: 1_000, withCredentials: true, onProgressCallback },
    );
    expect(request.optionValues.timeoutInMillis).toBe(1_000);
    expect(request.optionValues.withCredentials).toBe(true);
    expect(request.optionValues.onProgressCallback).toBe(onProgressCallback);
  });

  test('Verify that headers can be added', () => {
    const request = new MultipartHttpRequest(() => ({}), 'https://google.com/api', HttpMethod.POST, '/upload');
    request.headers({ Authorization: '123', Cookie: 'csrfToken=abcd' });
    expect(request.headersValue).toEqual({ Authorization: '123', Cookie: 'csrfToken=abcd' });
  });

  test('Verify that the hostname can be changed in the request', () => {
    const request = new MultipartHttpRequest(() => ({}), 'https://google.com/api', HttpMethod.POST, '/upload');
    request.hostname('coreoz.com');
    expect(request.buildUrl()).toBe('https://coreoz.com/api/upload');
  });

  test('Verify that options can be overridden', () => {
    const request = new MultipartHttpRequest(() => ({}), 'https://google.com/api', HttpMethod.POST, '/upload');
    request.options({ timeoutInMillis: 5_000, withCredentials: true });
    expect(request.optionValues.timeoutInMillis).toBe(5_000);
    expect(request.optionValues.withCredentials).toBe(true);
  });

  test('Verify that data is appended to the form data', () => {
    const request = new MultipartHttpRequest(() => ({}), 'https://google.com/api', HttpMethod.POST, '/upload');
    request.data([['password', 'pwd'], ['file', 'fileContent']]);
    expect(request.formData.get('password')).toBe('pwd');
    expect(request.formData.get('file')).toBe('fileContent');
  });

  test('Verify that undefined data entries are skipped', () => {
    const request = new MultipartHttpRequest(() => ({}), 'https://google.com/api', HttpMethod.POST, '/upload');
    request.data([['password', undefined], ['file', 'fileContent']]);
    expect(request.formData.has('password')).toBe(false);
    expect(request.formData.get('file')).toBe('fileContent');
  });

  test('Verify that a single file is added', () => {
    const request = new MultipartHttpRequest(() => ({}), 'https://google.com/api', HttpMethod.POST, '/upload');
    const file = new File(['content'], 'test.txt');
    request.file(file);
    expect(request.formData.get('file')).toBe(file);
  });

  test('Verify that multiple files are added', () => {
    const request = new MultipartHttpRequest(() => ({}), 'https://google.com/api', HttpMethod.POST, '/upload');
    const file1 = new File(['content1'], 'test1.txt');
    const file2 = new File(['content2'], 'test2.txt');
    request.files([file1, file2]);
    expect(request.formData.getAll('file')).toEqual([file1, file2]);
  });

  test('Verify that the URL is correctly built', () => {
    const request = new MultipartHttpRequest(() => ({}), 'https://google.com/api', HttpMethod.POST, '/upload');
    expect(request.buildUrl()).toBe('https://google.com/api/upload');
  });

  test('Verify that the request is executed through the client', () => {
    const client = (executedRequest: MultipartHttpRequest<unknown>) => executedRequest.path;
    const request = new MultipartHttpRequest(client, 'https://google.com/api', HttpMethod.POST, '/upload');
    expect(request.execute()).toBe('/upload');
  });

});
