const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export async function apiRequest(
    path,
    { method = "GET", token, body, signal } = {}
) {
    const headers = {
        Accept: "application/json",
    };

    if (body !== undefined) {
        headers["Content-Type"] = "application/json";
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    let response;

    try {
        response = await fetch(`${API_BASE_URL}${path}`, {
            method,
            headers,
            body: body === undefined ? undefined : JSON.stringify(body),
            signal,
        });
    } catch (error) {
        if (error.name === "AbortError") throw error;

        throw new Error(
            "Cannot reach the API. Check that the backend is running."
        );
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const error = new Error(
            data.message || `Request failed (${response.status}).`
        );
        error.status = response.status;
        throw error;
    }

    return data;
}