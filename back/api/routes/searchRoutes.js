// import { Router } from "express";
// import { validateToken } from "../../middleware/validateTokenMiddleware.js";
// import * as searchController from "../controllers/searchController.js";

// const route = Router();

// route.get('/search/activities', [validateToken], searchController.searchActivities);

// export default route;

// import { Router } from "express";
// import { validateToken } from "../../middleware/validateTokenMiddleware.js";
// import * as searchController from "../controllers/searchController.js";

// const route = Router();

// // Endpoint de autocompletado - retorna sugerencias
// route.get('/search/autocomplete', [validateToken], searchController.getAutocomplete);

// // Endpoint de búsqueda completa - retorna resultados
// route.get('/search/activities', [validateToken], searchController.searchActivities);

// export default route;

import { Router } from "express";
import { validateToken } from "../../middleware/validateTokenMiddleware.js";
import * as searchController from "../controllers/searchController.js";

const route = Router();

// GET /api/search/autocomplete?q=bio&types=multiplechoice,flashcard
route.get('/search/autocomplete', [validateToken], searchController.getAutocomplete);

// GET /api/search?q=bioquimica&types=multiplechoice,flashcard,atlas
route.get('/search', [validateToken], searchController.search);

export default route;