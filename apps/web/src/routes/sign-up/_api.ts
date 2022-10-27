/*
	This module is used by the /todos endpoint to
	make calls to api.svelte.dev, which stores todos
	for each user. The leading underscore indicates that this is
	a private module, _not_ an endpoint — visiting /todos/_api
	will net you a 404 response.

	(The data on the todo app will expire periodically; no
	guarantees are made. Don't use it to organise your life.)
*/

const API_STAGE = '/dev';
const API_BASE = `https://8qjflpsz7c.execute-api.eu-central-1.amazonaws.com${API_STAGE}`;

export function api(method: string, resource: string, data?: Record<string, unknown>) {
	
	return fetch(`${API_BASE}/${resource}`, {
		method,
		headers: {
			'content-type': 'application/json'
		},
		body: data && JSON.stringify(data)
	});
}

