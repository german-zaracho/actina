import { Router } from "express";
import * as controllers from '../controllers/authController.js';
import { validateAccount, validateProfile } from '../../middleware/validateAuthMiddleware.js';
import { validateToken } from "../../middleware/validateTokenMiddleware.js";

const route = Router();

route.post('/account/register', [validateAccount], controllers.createAccount);

route.post('/account', [validateAccount],controllers.createAccount);
route.post('/account/login', [validateAccount],controllers.login);
route.delete("/account",[validateAccount], controllers.logout);

route.get("/account", [validateToken], controllers.getAccount);
route.get("/account/role", [validateToken], controllers.getCurrentUserRole);

route.post("/profile",[ validateToken, validateProfile], controllers.createProfile);
route.put("/profile", [validateToken, validateProfile], controllers.updateProfile);
route.get("/profile",[ validateToken ], controllers.getProfile);
// Obtener perfil publico por ID
route.get("/profile/:userId", controllers.getPublicProfile);
// Obtener perfil publico por userName
route.get("/profile/by-username/:userName", controllers.getPublicProfileByUsername);

export default route