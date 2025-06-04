import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  apellidoPaterno: { type: String, required: true },
  apellidoMaterno: { type: String, required: true },
  fechaDeNacimiento: { type: Date, required: true },
  lugarDeNacimiento: { type: String, required: false },
  phone: { type: String, required: true },
  genero: { type: String, required: true },
  estatura: { type: String, required: false },
  peso: { type: String, required: false },
  curp: { type: String, required: false },
  estadoCivil: { type: String, required: false },
  educacion: { type: String, required: false },
  ocupacion: { type: String, required: false },
  ciudad: { type: String, required: false },
  estado: { type: String, required: false },
  calle: { type: String, required: false },
  colonia: { type: String, required: false },
  codigoPostal: { type: String, required: false },
  email: { type: String, required: true },
  nombreFamiliar: { type: String, required: false },
  phoneFamiliar: { type: String, required: false },
  emailFamiliar: { type: String, required: false },
  tabaco: { type: String, required: false },
  alcohol: { type: String, required: false },
  drogas: { type: String, required: false },
  actividad: { type: String, required: false },
  enfermedadCronica: { type: String, required: false },
  alergias: { type: String, required: false },
  cirugias: { type: String, required: false },
  trastornos: { type: String, required: false },
  cancer: { type: String, required: false },
  hipertension: { type: String, required: false },
  diabetes: { type: String, required: false },
  cancerF: { type: String, required: false },
  asma: { type: String, required: false },
  enfermedadN: { type: String, required: false },
});

// Export the model if it's already defined, otherwise define it
export default mongoose.models.Patient ||
  mongoose.model("Patient", PatientSchema);
