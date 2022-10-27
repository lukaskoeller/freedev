export const DEFAULT_ERROR_MESSAGE = 'An error occured. Please try again later.';
export const REQUIRED_ERROR_MESSAGE = 'This field is required.';

export type RestExceptionHandlerParams = {
  /**
   * HTTP response status code
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

export class RestExceptionHandler {
  status: number;
  message: string;
  debugMessage?: string;
  timestamp?: string;

  constructor(parameters: RestExceptionHandlerParams) {
    this.status = parameters.status;
    this.message = parameters.message;
    this.debugMessage = parameters?.debugMessage;
    this.timestamp = parameters?.timestamp ?? new Date().toISOString();
  }
}

export const RestExceptionNoBody = new RestExceptionHandler({
  status: 400,
  message: DEFAULT_ERROR_MESSAGE,
  debugMessage: 'No body (payload) was provided.'
});