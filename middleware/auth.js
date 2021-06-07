const jwt = require("jsonwebtoken");
const { json } = require("express");

module.exports = function (req, res, next) {
  // leer token del header
  const token = req.header("x-auth-token");
  // revisar si no hay token
  if (!token) res.status(401).json({ msg: "No hay token" });
  // validar el token
  try {
    const cifrado = jwt.verify(token, process.env.SECRETA);
    req.usuario = cifrado.usuario;
    next();//es para que vaya al siguiente middleware
  } catch (error) {
    res.status(401).json({ msg: "Token no válido" });
  }
};
