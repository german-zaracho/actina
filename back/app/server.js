import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import MultiplechoiceRoute from '../routes/routes.js';
import ApiMultiplechoiceRoute from '../api/routes/multiplechoiceRoutes.js';
import ApiFlashcardRoute from '../api/routes/flashcardsRoutes.js';
import ApiAtlasRoute from '../api/routes/atlasRoutes.js';
import ApiAuth from '../api/routes/authRoutes.js';
import ImageRoutes from '../api/routes/imageRoutes.js';
import AdminRoutes from '../api/routes/adminRoutes.js';
import FriendshipRoutes from '../api/routes/friendshipRoutes.js';
import cors from 'cors';

const app = express();

app.use(express.urlencoded({ extended: true })); //middleware para analizar datos pasados por la url
app.use("/", express.static("public")); //middleware para establecer archivos estaticos (ej que se apliquen los styles en todas las vistas sin importar la ruta)
app.use(express.json());    //middleware para poder analizar solicitudes en formato JSON 
app.use(cors());

app.use(MultiplechoiceRoute);
app.use('/api',ApiMultiplechoiceRoute);
app.use('/api',ApiFlashcardRoute);
app.use('/api',ApiAtlasRoute);

app.use('/api', ApiAuth);

app.use('/api', ImageRoutes);

app.use('/api', AdminRoutes);

app.use('/api', FriendshipRoutes);

// Pasa el puerto del servidor
app.listen(2023);