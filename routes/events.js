/*
Rutas de autenticación /api/events
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();

const {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
} = require("../controllers/events");

router.use(validarJWT); //Todas las rutas a partir de aquí usarán validación de JWT

router.get("/", getEventos);

//Crear un nuevo evento
router.post(
  "/",
  [
    check("title", "El título es obligatorio").not().isEmpty(),
    check("start", "La fecha de inicio es obligatoria").isDate(),
    check("end", "La fecha de fin es obligatoria").isDate(),
    check("end", "La fecha de fin debe ser posterior a la de inicio").custom(
      (value, { req }) => {
        const start = new Date(req.body.start);
        const end = new Date(value);
        if (end <= start) {
          throw new Error("La fecha de fin debe ser posterior a la de inicio");
        }
        return true;
      }
    ),
    validarCampos,
  ],
  crearEvento
);

//Actualizar un evento
router.put(
  "/:id",
  [
    check("title", "El titulo es obligatorio").not().isEmpty(),
    check("start", "Fecha de inicio es obligatoria").isDate(),
    check("end", "Fecha de finalización es obligatoria").isDate(),
    validarCampos,
  ],
  actualizarEvento
);

//Borrar un evento
router.delete("/:id", eliminarEvento);

module.exports = router;
