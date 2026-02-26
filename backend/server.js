// backend/server.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import vinoRoutes from './routes/vinoRoutes.js'; // Importamos las rutas
import userRoutes from './routes/userRouter.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
    origin: '*', // Permite peticiones desde cualquier lugar mientras desarrollas
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Conexión a DB
connectDB(process.env.MONGO_URI);

// Usar las rutas
app.use('/api/vinos', vinoRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Servidor en http://localhost:${PORT}`));

