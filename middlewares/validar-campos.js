const { response } = require("express");
const { validationResult } = require("express-validator");

const validarCampos = (req, res = response, next) => {
  // Errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errors.mapped(),
    });
  }
  
  next();
};

module.exports = {
  validarCampos,
};
