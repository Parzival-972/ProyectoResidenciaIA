import mongoose from "mongoose";

const MedicalImageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient", // Referencia al modelo de Paciente
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  tipoDeEstudio: {
    type: String,
    required: true,
    enum: [
        "Tomografía de Cráneo", 
        "Resonancia Magnética",
        "Rayos X",
        "Estudio de Dibujo",
        "Estudio de Audio",
        "Otro"
    ],
  },
  subidoPor: {
    type: String, // Nombre del profesional que subió el archivo
    required: true,
  },
  fechaDeCarga: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.MedicalImage ||
  mongoose.model("MedicalImage", MedicalImageSchema);