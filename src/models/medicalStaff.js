import mongoose from "mongoose";

const MedicalStaffSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      enum: ["Doctor", "Enfermero", "Técnico", "Administrador", "Otro"], // Define valid roles
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    id: {
      type: String,
      required: true,
      unique: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure unique email addresses
      lowercase: true, // Ensure emails are stored in lowercase
      trim: true,
    },
    password: {
      type: String,
      required: true, // Password must be provided
    },
    isVerified: {
      type: Boolean,
      default: false, // Defaults to unverified until verified
    },
    isApproved: {
      type: Boolean,
      default: false, // Defaults to unapproved until approved by admin
    },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

MedicalStaffSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    console.log("Hashing password for:", this.email); // Add this log
    const bcrypt = await import("bcryptjs");
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Check if the model is already registered to avoid overwriting errors during hot-reloading
export default mongoose.models.MedicalStaff ||
  mongoose.model("MedicalStaff", MedicalStaffSchema);
