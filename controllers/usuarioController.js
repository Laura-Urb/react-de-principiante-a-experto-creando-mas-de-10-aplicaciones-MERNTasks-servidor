const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.crearUsuario = async (req, res) => {
  // revisar si hay errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errores: errors.array() });
  }
  // extraer email y password
  const { email, password } = req.body;
  try {
    //validar que usuario sea unico
    let usuario = await Usuario.findOne({ email });
    if (usuario) return res.status(400).json({ msg: "El usuario ya existe" });
    // crea nuevo uusario
    usuario = new Usuario(req.body);
    // hashear el password
    const salt = await bcryptjs.genSalt(10);
    usuario.password = await bcryptjs.hash(password, salt);
    // guarda usuario
    await usuario.save();
    // crear y firmar jwt
    const payload = {
      usuario: {
        id: usuario.id,
      },
    };
    jwt.sign(
      payload,
      process.env.SECRETA,
      {
        expiresIn: 3600,
      },
      (error, token) => {
        if (error) throw error;
        // mensaje
        res.json({ token });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send("Hubo un error");
  }
};