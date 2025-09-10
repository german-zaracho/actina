import { Router } from "express"
import * as controllers from '../controllers/authController.js'
import { validateAccount, validateProfile } from '../../middleware/validateAuthMiddleware.js'
import { validateToken } from "../../middleware/validateTokenMiddleware.js"

const route = Router()

route.post('/account', [validateAccount],controllers.createAccount)
route.post('/account/login', [validateAccount],controllers.login)
route.delete("/account",[validateAccount], controllers.logout)

route.post("/profile",[ validateToken, validateProfile], controllers.createProfile)
route.get("/profile",[ validateToken ], controllers.getProfile)

export default route