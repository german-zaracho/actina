import { Router } from 'express'
import * as controllers from '../controllers/favoritesController.js'


const route = Router()

route.get('/products/:id/favorites', controllers.getFavorites)
route.post('/products/:id/favorites', controllers.addToFavorites)


export default route