// backend/server.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import vinoRoutes from './routes/vinoRoutes.js';
import userRoutes from './routes/userRouter.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Servir archivos estáticos (imágenes subidas)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Conexión a DB
connectDB(process.env.MONGO_URI);

// Usar las rutas
app.use('/api/vinos', vinoRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ventas', orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Servidor en http://localhost:${PORT}`));

