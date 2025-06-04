import mongoose from "mongoose";

const diagnosisSchema = new mongoose.Schema({
  userID: { type: String, required: true },
  diseaseName: { type: String, required: true },
  similarityPercentage: { type: Number, required: true }, // How close the diagnosis is in percentage
  imageUrl: { type: String, required: true }, // URL of diagnostic image
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Diagnosis ||
  mongoose.model("Diagnosis", diagnosisSchema);
