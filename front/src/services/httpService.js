export async function call({ url, method = "GET", body = undefined, port = 2023, basePath = "api" }) {

    const token = localStorage.getItem("token");

    const fullUrl = `http://localhost:${port}/${basePath ? basePath + "/" : ""}${url}`;

    // Debug: verificar el token
    console.log("Token being sent:", token);
    console.log("Making request to:", fullUrl);
    console.log("Method:", method);

    return fetch(fullUrl, {
        headers: {
            "auth-token": token,
            "Content-Type": "application/json",
        },
        method,
        body: body ? JSON.stringify(body) : undefined,
    }).then(async (response) => {
        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);

        if (!response.ok) {
            const errorData = await response.json();
            console.log("Error response:", errorData);

            if (response.status === 401) {
                console.log("Unauthorized - removing token");
                localStorage.removeItem("token");
            }

            throw errorData;
        }
        return response.json();
    }).catch(error => {
        console.error("Request error:", error);
        throw error;
    });

}

export default {
    call
}