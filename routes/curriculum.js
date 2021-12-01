const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const {
  getCurriculums,
  createCurriculum,
  showCurriculum,
  updateCurriculum,
  deleteCurriculum,
} = require('../controllers/curriculum');
const { validarJWT } = require('../middlewares/validar-jwt');

router.use(validarJWT);

router.get('/', getCurriculums);
router.get('/:id', [], showCurriculum);
router.post('/', [], createCurriculum);
router.put('/:id', [], updateCurriculum);
router.delete('/:id', [], deleteCurriculum);

module.exports = router;
