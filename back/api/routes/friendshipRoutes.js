import { Router } from "express";
import * as controllers from '../controllers/friendshipController.js';
import { validateToken } from "../../middleware/validateTokenMiddleware.js";

const route = Router();

route.get('/friends/search', [validateToken], controllers.searchUsers);
route.get('/friends', [validateToken], controllers.getFriends);
route.get('/friends/requests', [validateToken], controllers.getPendingRequests);
route.post('/friends/request', [validateToken], controllers.sendRequest);
route.post('/friends/accept/:id', [validateToken], controllers.acceptRequest);
route.delete('/friends/reject/:id', [validateToken], controllers.rejectRequest);
route.delete('/friends/:id', [validateToken], controllers.removeFriend);

export default route;