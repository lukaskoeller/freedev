const API_STAGE = '/dev';
const API_BASE = `https://nnz77jsq5c.execute-api.eu-central-1.amazonaws.com${API_STAGE}`;

export function api(method: string, resource: string, data?: Record<string, unknown>): unknown {
	return fetch(`${API_BASE}/${resource}`, {
		method,
		headers: {
			'content-type': 'application/json'
		},
		body: data && JSON.stringify(data)
	});
}
