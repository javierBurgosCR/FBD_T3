const { Schema, model } = require('mongoose');

const CurriculumSchema = Schema({
  //Llave foranea
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Informacion de contacto
  cedula: {
    type: String,
    require: true,
    uniqued: true,
  },
  name: {
    type: String,
    required: true,
  },
  surname1: {
    type: String,
    required: true,
  },
  surname2: {
    type: String,
    required: true,
  },
  tel: {
    type: String,
    required: true,
  },
  image: String,
  dateOfBirth: {
    type: Date,
    required: true,
  },
  // Educacion
  primary: {
    type: String,
  },
  school: {
    type: String,
    agno: Number,
    min: 1950,
    max: 2021,
  },
  careers: [{ university: String, title: String, level: String, year: Number }],
  // Experiencia laboral
  experience: [
    {
      position: String,
      description: String,
      in: Date,
      out: Date,
      working: Boolean,
    },
  ],
});

module.exports = model('Curriculum', CurriculumSchema);
