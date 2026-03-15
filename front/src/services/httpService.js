const BASE_URL = import.meta.env.VITE_API_URL || "";

export async function call({ url, method = "GET", body = undefined, basePath = "api" }) {

    const token = localStorage.getItem("token");
    const fullUrl = `${BASE_URL}/${basePath ? basePath + "/" : ""}${url}`;

    return fetch(fullUrl, {
        headers: {
            "auth-token": token,
            "Content-Type": "application/json",
        },
        method,
        body: body ? JSON.stringify(body) : undefined,
    }).then(async (response) => {
        if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 401) {
                localStorage.removeItem("token");
            }
            throw errorData;
        }
        return response.json();
    }).catch(error => {
        throw error;
    });
}

export default { call }