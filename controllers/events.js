const { response } = require("express");
const Evento = require("../models/Evento");

const getEventos = async (req, res = response) => {
  const eventos = await Evento.find()
    .populate("user", "name")
    .sort({ start: -1 }); // Ordenar eventos por fecha de inicio descendente

  res.json({
    ok: true,
    eventos,
  });
};

const crearEvento = async (req, res = response) => {
  const evento = new Evento(req.body);

  try {
    evento.user = req.uid; // Asignar el usuario que crea el evento
    const eventoCreado = await evento.save();

    res.json({
      ok: true,
      evento: eventoCreado,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado... revisar logs",
    });
  }
};

const actualizarEvento = async (req, res = response) => {
  const { id } = req.params;
  const evento = req.body;

  try {
    const eventoDB = await Evento.findById(id);
    if (!eventoDB) {
      return res.status(404).json({
        ok: false,
        msg: "Evento no encontrado",
      });
    }
    // Verificar que el usuario que actualiza es el mismo que creó el evento
    if (eventoDB.user.toString() !== req.uid) {
      return res.status(401).json({
        ok: false,
        msg: "No tienes permiso para actualizar este evento",
      });
    }
    const eventoActualizado = await Evento.findByIdAndUpdate(
      id,
      { ...evento, user: req.uid }, // Asegurarse de que el usuario sea el que actualiza
      { new: true } // Retornar el evento actualizado
    );

    res.json({
      ok: true,
      evento: eventoActualizado,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado... revisar logs",
    });
  }
};

const eliminarEvento = async (req, res = response) => {
  const { id } = req.params;

  try {
    const eventoDB = await Evento.findById(id);
    if (!eventoDB) {
      return res.status(404).json({
        ok: false,
        msg: "Evento no encontrado",
      });
    }
    // Verificar que el usuario que elimina es el mismo que creó el evento
    if (eventoDB.user.toString() !== req.uid) {
      return res.status(401).json({
        ok: false,
        msg: "No tienes permiso para eliminar este evento",
      });
    }
    await Evento.findByIdAndDelete(id);

    res.json({
      ok: true,
      id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado... revisar logs",
    });
  }
};

module.exports = {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
};
