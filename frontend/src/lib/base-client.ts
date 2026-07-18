import { BASEURL } from "./url";

/**
 * Typed error thrown for any non-2xx API response (or a network failure).
 * Carries the HTTP status and a human-readable message so the UI can show it.
 */
export class ApiError extends Error {
    readonly status: number;
    /** True when the request never reached the server (offline, CORS, DNS...). */
    readonly isNetworkError: boolean;

    constructor(message: string, status: number, isNetworkError = false) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.isNetworkError = isNetworkError;
    }
}

async function extractMessage(response: Response): Promise<string> {
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
            message = JSON.stringify(json);
        }
    } catch {
        message = response.statusText || message;
    }
    return message;
}

export async function request(path: string, init: RequestInit = {}): Promise<Response> {
    if (!BASEURL) {
        // Misconfiguration guard: fail loudly instead of fetching "undefined/..."
        throw new ApiError(
            "The app is misconfigured: NEXT_PUBLIC_API_URL is not set.",
            0,
            true
        );
    }

    const endpoint = `${BASEURL}/${path}`;

    let response: Response;
    try {
        response = await fetch(endpoint, init);
    } catch {
        // fetch only rejects on network-level failures.
        throw new ApiError(
            "Can't reach the server. Please check your connection and try again.",
            0,
            true
        );
    }

    if (!response.ok) {
        throw new ApiError(await extractMessage(response), response.status);
    }

    return response;
}
