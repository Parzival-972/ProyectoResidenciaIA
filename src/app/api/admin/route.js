import { NextResponse } from "next/server";
import connection from "../../../../libs/connection"; // Ensure this connects to MongoDB
import MedicalStaff from "@/models/medicalStaff"; // Import your schema
import mongoose from "mongoose";

// Fetch all staff
export async function GET() {
  try {
    await connection();

    // Retrieve all staff records
    const staff = await MedicalStaff.find({}).lean(); // Use `lean()` for better performance
    return NextResponse.json({ users: staff }, { status: 200 });
  } catch (error) {
    console.error("Error al conseguir personal:", error);
    return NextResponse.json(
      { message: "Error al conseguir personal", error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    await connection();

    const { id, role, isApproved } = await req.json();

    // Validate and convert `id` to ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "ID de Usuario inválido" },
        { status: 400 }
      );
    }

    const userId = new mongoose.Types.ObjectId(id);

    // Update fields dynamically
    const updateFields = {};
    if (role) updateFields.role = role;
    if (isApproved !== undefined) updateFields.isApproved = isApproved;

    const updatedUser = await MedicalStaff.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true } // Return updated document
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Se actualizó el usuario correctamente", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return NextResponse.json(
      { error: "Error al actualizar usuario", details: error.message },
      { status: 500 }
    );
  }
}

// Delete a staff member
export async function DELETE(req) {
  try {
    await connection();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "ID de Usuario es requerido" },
        { status: 400 }
      );
    }

    // Delete the staff member
    const deletedStaff = await MedicalStaff.findByIdAndDelete(id);

    if (!deletedStaff) {
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "User eliminado correctamente", user: deletedStaff },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar personal:", error);
    return NextResponse.json(
      { message: "Error al eliminar personal", error: error.message },
      { status: 500 }
    );
  }
}
