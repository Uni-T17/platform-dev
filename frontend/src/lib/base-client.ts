import { BASEURL } from "./url";

export async function request(path: string, init: RequestInit = {}) {
    const endpoint = `${BASEURL}/${path}`;

    const response = await fetch(endpoint, init);

    if (!response.ok) {
        // Try to parse a useful error message from the response body
        let message = `Request failed with status ${response.status}`;
        try {
            const json = await response.json();
            if (!json) {
                message = response.statusText || message;
            } else if (typeof json === "string") {
                message = json;
            } else if (json.message) {
                message = Array.isArray(json.message)
                    ? json.message.join(", ")
                    : String(json.message);
            } else if (json.error) {
                message = Array.isArray(json.error)
                    ? json.error.join(", ")
                    : String(json.error);
            } else {
                // fallback to stringify whatever the server returned
                message = JSON.stringify(json);
            }
        } catch (err) {
            // If body couldn't be parsed as json, use statusText
            message = response.statusText || message;
        }

        throw new Error(message);
    }

    return response;
}