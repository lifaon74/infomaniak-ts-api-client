import { InfomaniakLLM } from './llm/infomaniak-llm.class.ts';

/* TYPES */

export type IFetch = typeof fetch;

export interface InfomaniakClientOptions {
  /**
   * The Infomaniak token.
   */
  readonly apiKey: string;

  /**
   * The base url of the API (optional).
   */
  readonly baseURL?: string;

  /**
   * A custom implementation of `fetch` (optional).
   */
  readonly fetch?: IFetch;
}

export interface InfomaniakAPISuccessResponse<GData> {
  readonly result: 'success';
  readonly data: GData;
}

export function isInfomaniakAPISuccessResponse<GData>(
  input: InfomaniakAPIResponse<GData>
): input is InfomaniakAPISuccessResponse<GData> {
  return input.result === 'success';
}

export interface InfomaniakAPIErrorResponse {
  readonly result: 'error';
  // deno-lint-ignore no-explicit-any
  readonly error: any;
}

export function isInfomaniakAPIErrorResponse(
  input: InfomaniakAPIResponse<unknown>
): input is InfomaniakAPIErrorResponse {
  return input.result === 'success';
}

export type InfomaniakAPIResponse<GData> =
  | InfomaniakAPISuccessResponse<GData>
  | InfomaniakAPIErrorResponse
  ;

/* CLASS */

/**
 * This is the main entry point to communicate with the API.
 */
export class InfomaniakClient {
  readonly #apiKey: string;
  readonly #baseURL: string;
  readonly #fetch: IFetch;

  /**
   * This a view on the `InfomaniakLLM` service.
   */
  readonly llm: InfomaniakLLM;

  constructor(
    {
      apiKey,
      baseURL = 'https://api.infomaniak.com',
      fetch = globalThis.fetch,
    }: InfomaniakClientOptions,
  ) {
    this.#apiKey = apiKey;
    this.#baseURL = baseURL;
    this.#fetch = fetch;

    this.llm = new InfomaniakLLM(this);
  }

  /* API COMMUNICATION */

  get apiKey(): string {
    return this.#apiKey;
  }

  get baseURL(): string {
    return this.#baseURL;
  }

  /**
   * Creates a `Request` ready to communicate with the API.
   */
  request(
    input: URL | string,
    init: RequestInit = {},
  ): Request {
    return new Request(new URL(input, this.#baseURL), {
      headers: new Headers([
        ['Authorization', `Bearer ${this.#apiKey}`],
        ['Content-Type', 'application/json'],
        ...(init.headers as Iterable<[string, string]> ?? []),
      ]),
      ...init,
    });
  }

  /**
   * Performs an HTTP request on the Infomaniak API.
   */
  fetch(
    input: URL | string,
    init: RequestInit,
  ): Promise<Response> {
    return this.#fetch(this.request(input, init));
  }

  /**
   * Calls the Infomaniak API, and returns the `data` object.
   */
  json<GData>(
    input: URL | string,
    init: RequestInit,
  ): Promise<GData> {
    return this.#fetch(this.request(input, init))
      .then((response: Response): Promise<InfomaniakAPIResponse<GData>> => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`NetworkError: ${response.status} - ${response.statusText}`);
        }
      })
      .then((data: InfomaniakAPIResponse<GData>): GData => {
        if (isInfomaniakAPISuccessResponse(data)) {
          return data.data;
        } else {
          // TODO better report error
          throw new Error(
            JSON.stringify(data.error, null, 2),
          );
        }
      });
  }
}

