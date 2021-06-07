const Tarea = require("../models/Tarea");
const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");

exports.crearTarea = async (req, res) => {
  // revisar si hay errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errores: errors.array() });
  }
  // extraer el proyecto y comporbar si existe
  const { proyecto } = req.body;

  try {
    // verificar el proyecto
    const proyectoTarea = await Proyecto.findById(proyecto);
    if (!proyectoTarea) res.status(404).send("El proyecto no existe");
    // verificar el creador del proyecto
    if (proyectoTarea.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No Autorizado" });
    }
    // creamos la tarea
    const tarea = new Tarea(req.body);
    //guarda tarea
    tarea.save();
    res.json(tarea);
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

exports.obtenerTareas = async (req, res) => {
  // extraer el proyecto y comporbar si existe
  const { proyecto } = req.query;

  try {
    // verificar el proyecto
    const proyectoTarea = await Proyecto.findById(proyecto);
    if (!proyectoTarea) res.status(404).send("El proyecto no existe");
    // verificar el creador del proyecto
    if (proyectoTarea.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No Autorizado" });
    }
    // obtener tareas
    const tareas = await Tarea.find({ proyecto: proyecto }).sort({
      creado: -1,
    });
    res.json({ tareas });
  } catch (error) {
    console.log(error);
    res.status(500).send("Hubo un error");
  }
};

exports.actualizarTarea = async (req, res) => {
  // revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    // extraer la tarea y comprobar si existe
    const { proyecto, nombre, estado } = req.body;
    // verificar la tarea
    let tarea = await Tarea.findById(req.params.id);
    if (!tarea) res.status(404).send("La tarea no existe");
    // extraer el proyecto
    const proyectoTarea = await Proyecto.findById(proyecto);
    // verificar el creador del proyecto
    if (proyectoTarea.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No Autorizado" });
    }

    // crear un objeto con la info
    const nuevoTarea = {};
    nuevoTarea.nombre = nombre;
    nuevoTarea.estado = estado;

    // actualizar
    tarea = await Tarea.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: nuevoTarea },
      { new: true }
    );

    res.json({ tarea });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
};

exports.eliminarTarea = async (req, res) => {
  try {
    // extraer la tarea y comprobar si existe
    const { proyecto } = req.query;
    // verificar la tarea
    let tarea = await Tarea.findById(req.params.id);
    if (!tarea) res.status(404).send("La tarea no existe");
    // extraer el proyecto
    const proyectoTarea = await Proyecto.findById(proyecto);
    // verificar el creador del proyecto
    if (proyectoTarea.creador.toString() !== req.usuario.id) {
      return res.status(401).json({ msg: "No Autorizado" });
    }
    // eliminar
    await Tarea.findByIdAndRemove({ _id: req.params.id });

    res.json({ msg: "Tarea Eliminada" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
};
