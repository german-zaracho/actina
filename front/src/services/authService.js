import { call } from "./httpService";

export function login({ userName, password }) {
    return call({ 
        url: "account/login", 
        method: "POST", 
        body: { userName, password } 
    });
}

export function register({ userName, email, password }) {
    return call({
        url: "account/register",
        method: "POST",
        body: { userName, email, password }
    });
}

export function logout() {
    return call({ 
        url: "account", 
        method: "DELETE" 
    })
}

export function getProfile() {
    return call({ 
        url: "profile", 
        method: "GET" 
    })
}