const Proyecto = require("../models/Proyecto");
const Usuario = require("../models/Usuario");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

exports.crearProyecto = async (req, res) => {
  // revisar si hay errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errores: errors.array() });
  }
  try {
    let proyecto = new Proyecto(req.body);
    // guardar creador via JWT,
    proyecto.creador = req.usuario.id;
    //guarda proyecto
    proyecto.save();
    res.json(proyecto);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

exports.obtenerProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({
      creado: -1,
    });
    res.json({ proyectos });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

exports.actualizarProyecto = async (req, res) => {
  // Revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  // extraer la información del proyecto
  const { nombre } = req.body;
  const nuevoProyecto = {};

  if (nombre) {
    nuevoProyecto.nombre = nombre;
  }

  try {
    // revisar el ID
    let proyecto = await Proyecto.findById(req.params.id);

    // si el proyecto existe o no
    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    // verificar el creador del proyecto
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No Autorizado" });
    }

    // actualizar
    proyecto = await Proyecto.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: nuevoProyecto },
      { new: true }
    );

    res.json({ proyecto });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
};

exports.eliminarProyecto = async (req, res) => {
  try {
    // revisar el ID
    let proyecto = await Proyecto.findById(req.params.id);

    // si el proyecto existe o no
    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado" });
    }

    // verificar el creador del proyecto
    if (proyecto.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No Autorizado" });
    }
    await Proyecto.findByIdAndRemove({ _id: req.params.id });

    res.json({ msg: "Proyecto eliminado" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};
