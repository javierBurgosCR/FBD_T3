const { response, request } = require('express');
const User = require('../models/Usuario');
const bcrypt = require('bcryptjs');

const createUser = async (req = request, res = response) => {
  const { email, password } = req.body;
  try {
    // Buscamos algun usuario con ese email
    let usuario = await User.findOne({ email });

    // Si existe un usuario con ese email
    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: 'Este email no está disponible',
      });
    }

    // Nueva instancia de User
    const user = new User(req.body);

    // Encriptando la contraseña
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    // Guardamos al nuevo usuario en mongo
    await user.save();

    // Devolvemos
    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Ha ocurrido un error. No se pudo guardar',
    });
  }
};

const loginUser = (req, res = response) => {
  const { email, password } = req.body;
  res.status(200).json({
    ok: true,
    msg: 'login',
    email,
    password,
  });
};

const renewToken = (req, res = response) => {
  res.json({
    ok: true,
    msg: 'renew',
  });
};

module.exports = {
  createUser,
  loginUser,
  renewToken,
};
