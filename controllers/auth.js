const { response, request } = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

/****************************************************
/ Registrar nuevo usuario
*****************************************************/
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

    // Generamos el token
    const token = await generarJWT(user.id, user.name);

    // Devolvemos
    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Ha ocurrido un error. No se pudo guardar',
    });
  }
};

/****************************************************
/ Login de usuario
*****************************************************/
const loginUser = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // Buscamos algun usuario con ese email
    let user = await User.findOne({ email });

    // Si existe un usuario con ese email
    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: 'Usuario no encontrado',
      });
    }

    // comparamos la contraseña con la base de datos
    const validPassword = bcrypt.compareSync(password, user.password);

    // Si la contraseña no es valida
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'La contraseña no es valida',
      });
    }

    // Generar token
    const token = await generarJWT(user.id, user.name);

    // Devolvemos
    res.status(200).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Ha ocurrido un error. No se pudo hacer el login',
    });
  }
};

/****************************************************
/ Revalidar token de usuario
*****************************************************/
const renewToken = async (req, res = response) => {
  const { uid, name } = req;

  // Generar token
  const token = await generarJWT(uid, name);

  //
  res.json({
    ok: true,
    token,
  });
};

module.exports = {
  createUser,
  loginUser,
  renewToken,
};
