const API_STAGE = '/dev';
const API_BASE = `https://8qjflpsz7c.execute-api.eu-central-1.amazonaws.com${API_STAGE}`;

export type ApiParams = {
	/**
	 * Fetch function provided by SvelteKit.
	 * @see https://kit.svelte.dev/docs/load#making-fetch-requests
	 */
	fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
	method: string,
	/**
	 * The path to the endpoint.
	 */
	resource: string,
	data?: Record<string, unknown>,
	/**
	 * The access token to make authorized requests.
	 * Sets a `Authorization` property in `headers`.
	 * 
	 * Overwrites `Authorization` if provided in `headers`.
	 * Must be prefixed with the token type (e.g. 'Bearer').
	 */
	token?: string,
	headers?: Record<string, unknown>,
}

export function api(params: ApiParams) {
	const {
		fetch,
		method,
		resource,
		data,
		headers,
		token,
	} = params;
	
	return fetch(`${API_BASE}/${resource}`, {
		method,
		headers: {
			'content-type': 'application/json',
			...headers,
			...token ? { 'Authorization': `Bearer ${token}` } : {},
		},
		body: data && JSON.stringify(data),
	});
}

