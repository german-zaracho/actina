import { Router } from 'express'
import * as controllers from '../controllers/multiplechoiceController.js'
import routeFavorites from './favoritesRoutes.js'
import { validateMultiplechoice, validateMultiplechoicePatch } from '../../middleware/validateMiddleware.js'
import { validateToken } from '../../middleware/validateTokenMiddleware.js'

const route = Router()

//Cuando se da un click en los distintos botones o links se elige una ruta la cual envia informacion a la funcion de un controlador
//La diferencia con las rutas de la app, es que estas es cuando haces una consulta por crud con la base de datos
route.get('/multiplechoices', [validateToken], controllers.getMultiplechoices)

route.get('/multiplechoices/:id', [validateToken], controllers.getMultiplechoiceById)

route.all('/multiplechoices/:id', [validateToken], function todos(req, res, next) {
    console.log("multRoute ok?" )
    next()
})

// route.post('/multiplechoices', controllers.addMultiplechoice)
route.post('/multiplechoices',[validateMultiplechoice], controllers.addMultiplechoice)
// route.patch('/multiplechoices/:id', controllers.updateMultiplechoice)
route.patch('/multiplechoices/:id',[validateMultiplechoicePatch], controllers.updateMultiplechoice)

route.put('/multiplechoices/:id', controllers.replaceMultiplechoice)
route.delete("/multiplechoices/:id", controllers.deleteMultiplechoice)

route.use(routeFavorites)

export default route