import { Router } from 'express'
import * as controllers from '../controllers/atlasController.js'
// import routeFlashcards from './flashcardsRoutes.js'
import { validateAtlas, validateAtlasPatch } from '../../middleware/validateMiddleware.js'
import { validateToken } from '../../middleware/validateTokenMiddleware.js'

const route = Router()

//Cuando se da un click en los distintos botones o links se elige una ruta la cual envia informacion a la funcion de un controlador
//La diferencia con las rutas de la app, es que estas es cuando haces una consulta por crud con la base de datos
route.get('/atlas', [validateToken], controllers.getAll)
route.get('/atlas/:id', [validateToken], controllers.getById)

route.all('/atlas/:id', [validateToken], function todos(req, res, next) {
    console.log("atlasRoute ok?" )
    next()
})

route.post('/atlas',[validateAtlas], controllers.addAtlas)
route.patch('/atlas/:id',[validateAtlasPatch], controllers.updateAtlas)
route.put('/atlas/:id', controllers.replaceAtlas)
route.delete("/atlas/:id", controllers.deleteAtlas)

// route.use(routeFlashcards);

export default route