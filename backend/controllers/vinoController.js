import Vino from '../models/Vino.js';

export const createVino = async (req, res) => {
  try {
    const datos = { ...req.body };
    if (req.file) {
      datos.image = `/uploads/${req.file.filename}`;
    }
    const nuevoVino = new Vino(datos);
    const guardado = await nuevoVino.save();
    res.status(201).json(guardado);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al guardar el vino", error: error.message });
  }
};

// Actualizar un vino
export const updateVino = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = { ...req.body };
    if (req.file) {
      datos.image = `/uploads/${req.file.filename}`;
    }
    const vinoActualizado = await Vino.findByIdAndUpdate(id, datos, { new: true });

    if (!vinoActualizado) {
      return res.status(404).json({ mensaje: "Vino no encontrado" });
    }

    res.status(200).json(vinoActualizado);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar", error: error.message });
  }
};


export const getVinos = async (req, res) => {
  try {
    const vinos = await Vino.find();
    res.status(200).json(vinos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener vinos", error: error.message });
  }
};

export const getVinoById = async (req, res) => {
  try {
    const vino = await Vino.findById(req.params.id);
    if (!vino) return res.status(404).json({ mensaje: "Vino no encontrado" });
    res.status(200).json(vino);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener el vino", error: error.message });
  }
};
export const deleteVino = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Vino.findByIdAndDelete(id);

    if (!eliminado) {
      return res.status(404).json({ mensaje: "Vino no encontrado" });
    }

    res.status(200).json({ mensaje: "Vino eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar", error: error.message });
  }
};