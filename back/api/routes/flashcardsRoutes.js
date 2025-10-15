import { Router } from 'express'
import * as controllers from '../controllers/flashcardController.js'
// import routeAtlas from './atlasRoutes.js'
import { validateFlashcard, validateFlashcardPatch } from '../../middleware/validateMiddleware.js'
import { validateToken } from '../../middleware/validateTokenMiddleware.js'

const route = Router()

//Cuando se da un click en los distintos botones o links se elige una ruta la cual envia informacion a la funcion de un controlador
//La diferencia con las rutas de la app, es que estas es cuando haces una consulta por crud con la base de datos
route.get('/flashcards', [validateToken], controllers.getFlashcards)
route.get('/flashcards/:id', [validateToken], controllers.getFlashcardById)

route.all('/flashcards/:id', [validateToken], function todos(req, res, next) {
    console.log("flashRoute ok?" )
    next()
})

route.post('/flashcards',[validateFlashcard], controllers.addFlashcard)
route.patch('/flashcards/:id',[validateFlashcardPatch], controllers.updateFlashcard)
route.put('/flashcards/:id', controllers.replaceFlashcard)
route.delete("/flashcards/:id", controllers.deleteFlashcard)

// route.use(routeAtlas)

export default route