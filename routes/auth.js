/*
    Rutas de Usuarios / Auth
    path: api/auth
*/

const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');

const { createUser, loginUser, renewToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

router.post(
  '/register',
  [
    check('name', 'El nombre es requerido').notEmpty(),
    check('name', 'El nombre debe tener al menos 2 caracteres').isLength({
      min: 2,
      max: 50,
    }),
    check('email', 'El correo debe ser valido').isEmail(),
    check(
      'password',
      'La contraseña debe tener al menos 8 caracteres'
    ).isLength({ min: 8, max: 50 }),
    validarCampos,
  ],
  createUser
);

router.post(
  '/login',
  [
    check('email', 'El correo debe ser valido').isEmail(),
    check(
      'password',
      'La contraseña debe tener al menos 8 caracteres'
    ).isLength({ min: 8 }),
    validarCampos,
  ],
  loginUser
);

router.get('/renew', validarJWT, renewToken);

module.exports = router;
