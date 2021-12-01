const { response, request } = require('express');
const Curriculum = require('../models/Curriculum');

/****************************************************
/ Get curriculums
*****************************************************/
const getCurriculums = async (req = request, res = response) => {
  try {
    const curriculums = await Curriculum.find().populate('user');
    res.status(200).json({
      ok: true,
      msg: 'Curriculum lista',
      curriculums,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado, comuniquese con el administrador1',
    });
  }
};

/****************************************************
/ Show curriculum
*****************************************************/
const showCurriculum = async (req = request, res = response) => {
  try {
    const userId = req.params.id;

    const curriculum = await Curriculum.findById(userId).populate('user');

    if (!curriculum) {
      res.status(404).json({
        ok: false,
        msg: 'Error, Curriculum no encontrado',
      });
    }
    res.status(200).json({
      ok: true,
      msg: 'Curriculum encontrado',
      curriculum,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado, comuniquese con el administrador1',
    });
  }
};
/****************************************************
/ Create curriculum
*****************************************************/
const createCurriculum = async (req = request, res = response) => {
  const curriculum = new Curriculum(req.body);

  try {
    curriculum.user = req.uid;
    const curriculumGuardado = await curriculum.save();

    res.status(201).json({
      ok: true,
      msg: 'Curriculum guardado exitosamente!!!',
      curriculumGuardado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado, comuniquese con el administrador',
    });
  }
};
/****************************************************
/ Update curriculum
*****************************************************/
const updateCurriculum = async (req = request, res = response) => {
  try {
    const curriculumId = req.params.id;
    const userId = req.uid;
    //console.log(userId);

    const curriculum = await Curriculum.findById(curriculumId).populate('user');

    // Si no existe el curriculum
    if (!curriculum) {
      res.status(404).json({
        ok: false,
        msg: 'Error, Curriculum no encontrado',
      });
    }

    // Si no es del mismo usuario
    if (curriculum.user._id.toString() !== req.uid) {
      res.status(401).json({
        ok: false,
        msg: 'Error, Solo puede actualizar su propio curriculum',
      });
    }

    const nuevoCurriculum = {
      ...curriculum._doc,
      ...req.body,
      user: req.uid,
    };

    //console.log(curriculum);
    console.log(nuevoCurriculum);
    //console.log(data);

    const curriculumActualizado = await Curriculum.findByIdAndUpdate(
      curriculumId,
      nuevoCurriculum,
      { new: true }
    );

    return res.status(200).json({
      ok: true,
      msg: 'Curriculum actualizado correctamente!!!',
      curriculum: curriculumActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado, comuniquese con el administrador1',
    });
  }
};
/****************************************************
/ Delete curriculum
*****************************************************/
const deleteCurriculum = async (req = request, res = response) => {
  try {
    const curriculumId = req.params.id;
    const userId = req.uid;

    const curriculum = await Curriculum.findById(curriculumId);

    // Si no existe el curriculum
    if (!curriculum) {
      res.status(404).json({
        ok: false,
        msg: 'Error, Curriculum no encontrado',
      });
    }

    // Si no es del mismo usuario
    if (curriculum.user._id.toString() !== userId) {
      res.status(401).json({
        ok: false,
        msg: 'Error, Solo puede actualizar su propio curriculum',
      });
    }

    await Curriculum.findByIdAndDelete(curriculumId);

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado, no se pudo borrar el curriculum',
    });
  }
};

module.exports = {
  getCurriculums,
  showCurriculum,
  createCurriculum,
  updateCurriculum,
  deleteCurriculum,
};
