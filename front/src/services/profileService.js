import { call } from "./httpService";

export function getProfile() {
    return call({ 
        url: "profile", 
        method: "GET" 
    });
}

export function updateProfile(profileData) {
    return call({ 
        url: "profile", 
        method: "PUT", 
        body: profileData 
    });
}

export function getAvailableImages() {
    return call({ 
        url: "images/profile", 
        method: "GET",
        // port: 3333,
        // basePath: "" 
    });
}