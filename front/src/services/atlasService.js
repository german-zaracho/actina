import { call } from "./httpService";

export function getAtlas() {
    return call({ url: "atlas" });
}

export function getAtla(id) {
    return call({ url: `atlas/${id}` });
}

export default {
    getAtlas,
    getAtla
};