import * as friendshipService from '../../services/friendshipService.js';

async function sendRequest(req, res) {
    try {
        const { friendId } = req.body;
        const result = await friendshipService.sendFriendRequest(req.account._id, friendId);
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ error: { message: err.message } });
    }
}

async function acceptRequest(req, res) {
    try {
        const result = await friendshipService.acceptFriendRequest(req.params.id, req.account._id);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: { message: err.message } });
    }
}

async function rejectRequest(req, res) {
    try {
        const result = await friendshipService.rejectFriendRequest(req.params.id, req.account._id);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: { message: err.message } });
    }
}

async function removeFriend(req, res) {
    try {
        const result = await friendshipService.removeFriend(req.params.id, req.account._id);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: { message: err.message } });
    }
}

async function getFriends(req, res) {
    try {
        const friends = await friendshipService.getFriends(req.account._id);
        res.json(friends);
    } catch (err) {
        res.status(500).json({ error: { message: err.message } });
    }
}

async function getPendingRequests(req, res) {
    try {
        const requests = await friendshipService.getPendingRequests(req.account._id);
        res.json(requests);
    } catch (err) {
        res.status(500).json({ error: { message: err.message } });
    }
}

async function searchUsers(req, res) {
    try {
        const { q } = req.query;
        if (!q || q.trim().length < 2) {
            return res.status(400).json({ error: { message: "Búsqueda debe tener al menos 2 caracteres" } });
        }
        const users = await friendshipService.searchUsers(q.trim(), req.account._id);
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: { message: err.message } });
    }
}

export {
    sendRequest,
    acceptRequest,
    rejectRequest,
    removeFriend,
    getFriends,
    getPendingRequests,
    searchUsers
};