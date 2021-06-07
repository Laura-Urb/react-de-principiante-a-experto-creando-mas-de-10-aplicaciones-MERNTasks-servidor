const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.autenticarUsuario = async (req, res) => {
  // revisar si hay errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errores: errors.array() });
  }
  // extraer email y password
  const { email, password } = req.body;
  try {
    // revisar que el usuario existe
    let usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(400).json({ msg: "El usuario no existe" });
    // revisar el password
    const passCorrecta = await bcryptjs.compare(password, usuario.password);
    if (!passCorrecta)
      return res.status(400).json({ msg: "Password incorrecta" });

    // si todo es correcto crear y firmar jwt
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
    // res.status(400).send("Hubo un error");
  }
};

exports.usuarioAutenticado = async (req, res) => {
  try {
    // revisar que el usuario existe
    const usuario = await Usuario.findById(req.usuario.id).select("-password");
    if (!usuario) return res.status(400).json({ msg: "El usuario no existe" });
    res.json({ usuario });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Hubo un error" });
  }
};
