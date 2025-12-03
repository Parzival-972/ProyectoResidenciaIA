import mongoose from "mongoose";

const ClinicalDiagnosisSchema = new mongoose.Schema(
  {   
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient", 
      required: true,
    },

    medicalStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalStaff", 
      required: true,
    },

    medicalImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalImage", 
      required: true,
    },

    // --- DATOS QUE VIENEN DE LA NEURO-API ---
    diagnosticoIA: {
      type: String,
      required: true,
    }, 

    nivelCerteza: {
      type: Number,
      required: true,
    },

    modeloUsado: {
      type: String,
      required: true,
    }, 

    // --- VALIDACIÓN DEL MÉDICO ---
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