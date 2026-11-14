// Sends a request to the Express backend and returns the JSON response.
// With a body it sends a POST request, otherwise a GET request.
export async function request(url, body) {
    const options = body
        ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
        : {};

    let response;
    try {
        response = await fetch(url, options);
    } catch {
        throw new Error('Cannot reach the server. Make sure it is running.');
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.error || 'An error occurred.');
    }
    return data;
}
