import express from "express";
import * as controllers from '../controllers/controllers.js'

const route = express.Router();

//Cuando se da un click en los distintos botones o links se elige una ruta la cual envia informacion a la funcion de un controlador
route.get("/multiplechoices", controllers.getMultiplechoices);

route.get('/:subject', controllers.getMultiplechoicesBySubject);//Sin importar la seccion que se clickee redirige en base a la materia por el param de la url

route.get("/multiplechoices/new", controllers.createMultiplechoiceFormPage);
route.post("/multiplechoices/new", controllers.createMultiplechoice);

route.get( "/multiplechoices/edit/:multiplechoice_id", controllers.editMultiplechoiceFrom );
route.post( "/multiplechoices/edit/:multiplechoice_id", controllers.editMultiplechoice );

route.get("/multiplechoices/delete/:multiplechoice_id", controllers.deleteMultiplechoiceFrom);
route.post("/multiplechoices/delete/:multiplechoice_id", controllers.deleteMultiplechoice);

route.get("/multiplechoices/:multiplechoice_id", controllers.getMultiplechoicebyId);

export default route;