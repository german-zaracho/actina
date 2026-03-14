import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import ApiMultiplechoiceRoute from '../api/routes/multiplechoiceRoutes.js';
import ApiFlashcardRoute from '../api/routes/flashcardsRoutes.js';
import ApiAtlasRoute from '../api/routes/atlasRoutes.js';
import ApiAuth from '../api/routes/authRoutes.js';
import ImageRoutes from '../api/routes/imageRoutes.js';
import AdminRoutes from '../api/routes/adminRoutes.js';
import FriendshipRoutes from '../api/routes/friendshipRoutes.js';
import UserActivitiesRoutes from '../api/routes/userActivitiesRoutes.js';
import SearchRoutes from '../api/routes/searchRoutes.js';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Archivos estáticos del backend (public/)
app.use("/", express.static("public"));

// Rutas de la API
app.use('/api', ApiMultiplechoiceRoute);
app.use('/api', ApiFlashcardRoute);
app.use('/api', ApiAtlasRoute);
app.use('/api', ApiAuth);
app.use('/api', ImageRoutes);
app.use('/api', AdminRoutes);
app.use('/api', FriendshipRoutes);
app.use('/api', UserActivitiesRoutes);
app.use('/api', SearchRoutes);

// Servir el frontend buildeado (front/dist/)
// Esto solo aplica en producción (Render), localmente el front corre con Vite
const frontendDist = path.join(__dirname, '../../../front/dist');
app.use(express.static(frontendDist));

// Cualquier ruta que no sea /api la maneja React Router
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
});

const PORT = process.env.PORT || 2023;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
