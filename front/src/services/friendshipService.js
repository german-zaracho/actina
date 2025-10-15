import { call } from "./httpService";

export function searchUsers(query) {
    return call({ url: `friends/search?q=${encodeURIComponent(query)}`, method: "GET" });
}

export function getFriends() {
    return call({ url: "friends", method: "GET" });
}

export function getPendingRequests() {
    return call({ url: "friends/requests", method: "GET" });
}

export function sendFriendRequest(friendId) {
    return call({ url: "friends/request", method: "POST", body: { friendId } });
}

export function acceptFriendRequest(friendshipId) {
    return call({ url: `friends/accept/${friendshipId}`, method: "POST" });
}

export function rejectFriendRequest(friendshipId) {
    return call({ url: `friends/reject/${friendshipId}`, method: "DELETE" });
}

export function removeFriend(friendshipId) {
    return call({ url: `friends/${friendshipId}`, method: "DELETE" });
}