import { Router } from "express";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();

// Para obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta para obtener lista de imágenes disponibles
router.get('/images/profile', (req, res) => {
    try {
        // Desde api/routes/ ir a src/assets/images/profile-imgs/
        const imagesPath = path.join(__dirname, '../../../src/assets/images/profile-imgs');
        
        // Leer el directorio
        const files = fs.readdirSync(imagesPath);
        
        // Filtrar solo archivos de imagen
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext);
        });
        
        res.json(imageFiles);
    } catch (error) {
        console.error('Error reading images directory:', error);
        // Fallback: retornar lista por defecto
        res.json(['avatar1.jpg', 'avatar2.jpg', 'avatar3.jpg', 'avatar4.jpg', 'avatar5.jpg']);
    }
});

// Ruta para servir las imágenes
router.get('/images/profile/:imageName', (req, res) => {
    try {
        const imageName = req.params.imageName;
        // Desde api/routes/ ir a src/assets/images/profile-imgs/
        const imagePath = path.join(__dirname, '../../../src/assets/images/profile-imgs', imageName);
        
        // Verificar que el archivo existe
        if (!fs.existsSync(imagePath)) {
            return res.status(404).json({ error: 'Image not found' });
        }
        
        res.sendFile(imagePath);
    } catch (error) {
        console.error('Error serving image:', error);
        res.status(500).json({ error: 'Error serving image' });
    }
});

export default router;