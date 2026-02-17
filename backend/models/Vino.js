import mongoose from 'mongoose';

// El Schema define la estructura de cada documento en MongoDB
const vinoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "El nombre del vino es obligatorio"],
    trim: true
  },
  bodega: {
    type: String,
    required: [true, "La bodega es obligatoria"]
  },
  anio: {
    type: Number,
    min: [1900, "Año no válido"]
  },
  tipo: {
    type: String,
    enum: ['Tinto', 'Blanco', 'Rosado', 'Espumante'], // Solo permite estos valores
    default: 'Tinto'
  },
  precio: {
    type: Number,
    default: 0
  },
  stock: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true // Esto crea automáticamente campos de "createdAt" y "updatedAt"
});

// Creamos el modelo basado en el esquema
const Vino = mongoose.model('Vino', vinoSchema);

export default Vino;