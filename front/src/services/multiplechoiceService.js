import { call } from "./httpService";

export function getMultiplechoices() {
    return call({ url: "multiplechoice" });
}

export function getMultiplechoice(id) {
    return call({ url: `multiplechoice/${id}` });
}

export default {
    getMultiplechoices,
    getMultiplechoice
};