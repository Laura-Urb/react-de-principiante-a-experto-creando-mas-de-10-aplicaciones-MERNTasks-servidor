// rutas para autenticar usuarios
const express = require("express");
const router = express.Router();
const tareaController = require("../controllers/tareaController");
const auth = require("../middleware/auth");
const { check } = require("express-validator");

// crear un tarea
// api/tareas
router.post(
  "/",
  auth,
  [check("nombre", "El nombre es obligatorio").not().isEmpty()],
  [check("proyecto", "El proyecto es obligatorio").not().isEmpty()],
  tareaController.crearTarea
);
//traer tareas
router.get("/", auth, tareaController.obtenerTareas);
//actualizar tareas
router.put(
  "/:id",
  auth,
  [check("nombre", "El nombre es obligatorio").not().isEmpty()],
  tareaController.actualizarTarea
);
// eliminar  tarea
router.delete("/:id", auth, tareaController.eliminarTarea);

module.exports = router;
