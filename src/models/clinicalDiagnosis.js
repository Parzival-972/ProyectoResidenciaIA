import mongoose from "mongoose";

const ClinicalDiagnosisSchema = new mongoose.Schema(
  {   
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient", // Referencia al modelo de Paciente
    required: true,
  },

    profesional: {
    type: String, // Nombre del profesional que subió el archivo
    required: true,
  },

    medicalImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalImage", 
      required: true,
    },

    diagnosticoIA: {
      type: String,
      required: true,
    }, 

    nivelCerteza: {
      type: Number,
      required: true,
      min: 0,   
      max: 100,
    },

    modeloUsado: {
      type: String,
      required: true,
    }, 

    esCorrecto: {
      type: Boolean,
      default: null, 
    },
    
    notasMedico: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Evitamos errores de re-compilación al usar hot-reload en Next.js/Node
export default mongoose.models.ClinicalDiagnosis ||
  mongoose.model("ClinicalDiagnosis", ClinicalDiagnosisSchema);