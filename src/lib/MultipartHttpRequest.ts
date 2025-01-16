import { HttpMethod } from './HttpMethod';

export type MultipartHttpOptions = {
  /**
   * The request timeout in milliseconds. Default timeout is {@link DEFAULT_TIMEOUT_IN_MILLIS}.
   */
  timeoutInMillis: number,
  /**
   * Callback called each time upload.onprogress function of the XmlHttpRequest is called
   * @param event the event provided by upload.onprogress function
   */
  onProgressCallback: (event: ProgressEvent) => void,
  /**
   * Value given to the XmlHttpRequest optionValues. Default value is false.
   * For more information https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials
   */
  withCredentials: boolean,
};

export type MultipartHttpClient<T> = (request: MultipartHttpRequest<unknown>) => T;

export class MultipartHttpRequest<T> {
  private static readonly DEFAULT_TIMEOUT_IN_MILLIS: number = 60_000; // 1 minute

  /**
   * The client that will take the request as a parameter, execute it, and return a result.
   * This result can be a {@link Promise}.
   *
   * This value is set in the {@link constructor}.
   */
  readonly multipartHttpClient: MultipartHttpClient<T>;

  /**
   * The base URL. A valid base URL is: http://hostname/api
   *
   * This value is set in the {@link constructor}.
   */
  readonly baseUrl: URL;

  /**
   * The HTTP method used for the request, see {@link HttpMethod}.
   *
   * This value is set in the {@link constructor}.
   */
  readonly method: HttpMethod;

  /**
   * The path of the endpoint to call, it should be composed with a leading slash
   * and will be appended to the {@link baseUrl}. A valid path is: /users
   *
   * This value is set in the {@link constructor}.
   */
  readonly path: string;

  /**
   * The request HTTP headers.
   *
   * This value is set in the {@link headers} method.
   */
  readonly headersValue: HeadersInit;

  /**
   * The request data
   *
   * This value is set in the {@link data} method.
   */
  readonly formData: FormData;

  /**
   * The request {@link HttpOptions}.
   *
   * This value is set in the {@link constructor}.
   */
  readonly optionValues: MultipartHttpOptions;

  constructor(
    multipartHttpClient: MultipartHttpClient<T>,
    baseUrl: string,
    method: HttpMethod,
    path: string,
    options?: Partial<MultipartHttpOptions>,
  ) {
    this.multipartHttpClient = multipartHttpClient;
    this.baseUrl = new URL(baseUrl);
    this.method = method;
    this.path = path;
    this.headersValue = {};
    this.formData = new FormData();
    this.optionValues = {
      timeoutInMillis: options?.timeoutInMillis ?? MultipartHttpRequest.DEFAULT_TIMEOUT_IN_MILLIS,
      onProgressCallback: options?.onProgressCallback ?? (() => {}),
      withCredentials: options?.withCredentials ?? false,
    };
  }

  /**
   * Add one or multiple headers to the request.
   *
   * To set the `Host` header, {@link hostname} must be used. Else the value will be ignored.
   * The list of headers that cannot be set is available at
   * <https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name>
   *
   * @param headers A key/value object with:
   * **key**: the header name,
   * **value**: the header value.
   * A valid headers object is: `{Authorization: 123, Cookie: csrfToken=abcd}`.
   */
  headers(headers: Record<string, string>) {
    Object.assign(this.headersValue, headers);
    return this;
  }

  /**
   * Change the hostname of the `baseUrl`.
   * If the `baseUrl` is `https://google.com/api` and the hostname is changed to
   * `github.com`, then the `baseUrl` will be `https://github.com/api`
   *
   * It can be useful to set the `Host` header since fetch does not support
   * setting the `Host` header directly.
   * @param hostname The new hostname of the `baseUrl`
   */
  hostname(hostname: string) {
    this.baseUrl.hostname = hostname;
    return this;
  }

  /**
   * Add data to the multipart request A sample usage is:
   * `request.data([['file', fileData],['password', password]])`.
   *
   * @param multipartHttpData An array of the form data to add
   */
  data(multipartHttpData: [string, string | Blob | undefined][]) {
    for (const multipartHttpDataEntry of multipartHttpData) {
      if (multipartHttpDataEntry[1]) {
        this.formData.append(multipartHttpDataEntry[0], multipartHttpDataEntry[1]);
      }
    }
    return this;
  }

  file(file: File) {
    this.data([['file', file]]);
    return this;
  }

  files(files: File[]) {
    this.data(files.map((file: File) => ['file', file]));
    return this;
  }

  /**
   * Build the full request URL using {@link baseUrl}, {@link path}, {@link queryParamsValue}.
   */
  buildUrl() {
    return encodeURI(this.baseUrl.toString() + this.path);
  }

  /**
   * Execute the request using the {@link multipartHttpClient}.
   */
  execute(): T {
    return this.multipartHttpClient(this);
  }
}
