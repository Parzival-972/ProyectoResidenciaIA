const mongoose = require("mongoose");

const medicalFormSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  edad: {
    type: Number,
    required: true,
  },
  clasificacionEdad: {
    type: String,
    enum: [
      "Primera infancia",
      "Infancia",
      "Adolescencia",
      "Juventud",
      "Adultez",
      "Vejez",
    ],
    required: true,
  },
  peso: {
    type: Number,
    required: true,
  },
  altura: {
    type: Number,
    required: true,
  },
  imc: {
    type: Number,
    required: true,
  },
  clasificacionIMC: {
    type: String,
    enum: ["Bajo peso", "Normal", "Sobrepeso", "Obesidad"],
    required: true,
  },
  hipertensionArterial: {
    type: Boolean,
    default: false,
  },
  presionSistolica: {
    type: Number,
  },
  presionDiastolica: {
    type: Number,
  },
  consumoAlcohol: {
    type: Boolean,
    default: false,
  },
  unidadesSemana: {
    type: Number,
  },
  fumador: {
    type: Boolean,
    default: false,
  },
  cigarrillosSemana: {
    type: Number,
  },
  edadInicioFumar: {
    type: Number,
  },
  minutosActividad: {
    type: Number,
    required: true,
  },
  actividadClasificacion: {
    type: String,
    enum: ["Muy alto", "Alto", "Medio", "Bajo", "Sin actividad"],
    required: true,
  },
  anosEstudio: {
    type: Number,
    required: true,
  },
  clasificacionEstudio: {
    type: String,
    enum: [
      "primaria",
      "secundaria",
      "preparatoria trunca",
      "preparatoria",
      "universidad",
      "estudios avanzados",
    ],
    required: true,
  },
  diabetesValue: {
    type: Number,
    enum: [0, 1, 2, 3],
    required: true,
  },
  diabetesClasificacion: {
    type: String,
    enum: ["Ninguno", "Tipo 1", "Tipo 2", "Tipo 2 controlado"],
    required: true,
  },
  calidadAireValue: {
    type: Number,
    required: true,
  },
  calidadAireClasificacion: {
    type: String,
    enum: ["Muy alto", "Alto", "Medio", "Bajo"],
    required: true,
  },
  discapacidadAuditiva: {
    type: Boolean,
    default: false,
  },
  porcentajeDiscapacidad: {
    type: Number,
    required: function () {
      return this.discapacidadAuditiva;
    },
  },
  traumatismo: {
    type: Boolean,
    default: false,
  },
  porcentajeTraumatismo: {
    type: Number,
    required: function () {
      return this.traumatismo;
    },
  },
});

// Check if the model already exists to avoid OverwriteModelError
const MedicalForm =
  mongoose.models.MedicalForm ||
  mongoose.model("MedicalForm", medicalFormSchema);

module.exports = MedicalForm;
