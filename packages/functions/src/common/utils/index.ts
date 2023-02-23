import { INTERNAL_ERROR_MESSAGE } from "errors";
import { ZodError } from "zod";
import { fromZodError } from 'zod-validation-error';

export const serialize = <BodyType extends Record<string, any>>(object: BodyType): string => (
  JSON.stringify(object, null, 2)
);

export type ApiResponseParams<BodyType> = {
  /**
   * HTTP response status code
   * @url https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
   */
  statusCode: number,
  /**
   * Body as stringified JSON
   */
  body?: BodyType,
}

export class ApiResponse<BodyType> {
  statusCode: number;
  body?: string | undefined;
  headers: Record<string, string>;

  constructor(parameters: ApiResponseParams<BodyType>) {
    this.statusCode = parameters.statusCode;
    this.body = parameters?.body ? serialize(parameters?.body) : undefined;
    this.headers = {
      'Content-Type': 'application/json',
    }
  }
}

export type BodyErrorType = {
  /**
   * HTTP response status code of 4xx or 5xx
   * @url https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
   */
  status: number,
  /**
   * Holds a user-friendly message about the error.
   */
  message: string,
  /**
   * Holds a system message describing the error in more detail.
   */
  debugMessage?: string,
  /**
   * Holds the date-time instance of when the error happened.
   */
  timestamp?: string,
}

export class ApiErrorResponse extends ApiResponse<BodyErrorType> {};

export const NoBodyException = new ApiErrorResponse({
  statusCode: 400,
  body: {
    status: 400,
    message: 'Expected a body but did not receive one.',
    debugMessage: 'Check if client side validations are applied and body is passed in the api request',
  }
});

export const SchemaException = (zodError: ZodError) => new ApiErrorResponse({
  statusCode: 400,
  body: {
    status: 400,
    message: fromZodError(zodError).message,
    debugMessage: JSON.stringify(zodError),
  }
});

/**
 * @todo replace by InternalErrorException from aws?
 */
export const InternalErrorException = new ApiErrorResponse({
  statusCode: 500,
  body: {
    status: 500,
    message: INTERNAL_ERROR_MESSAGE,
  },
});