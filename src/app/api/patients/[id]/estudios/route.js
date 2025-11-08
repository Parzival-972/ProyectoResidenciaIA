import { NextResponse } from "next/server";
import connection from "../../../../../../libs/connection";
import MedicalImage from "../../../../../models/medicalImage";

// GET - Obtener todos los estudios de un paciente
export async function GET(request, { params }) {
  try {
    await connection();
    const { id } = params;

    const estudios = await MedicalImage.find({ userId: id }).sort({ fechaDeCarga: -1 });

    return NextResponse.json(estudios);
  } catch (error) {
    console.error("Error al obtener los estudios:", error);
    return NextResponse.json(
      { error: "Error al obtener los estudios" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un estudio
export async function DELETE(request) {
  try {
    await connection();
    const { estudioId } = await request.json();

    if (!estudioId) {
      return NextResponse.json({ error: "El ID del estudio es requerido" }, { status: 400 });
    }

    const deletedEstudio = await MedicalImage.findByIdAndDelete(estudioId);

    if (!deletedEstudio) {
      return NextResponse.json({ error: "Estudio no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Estudio eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el estudio:", error);
    return NextResponse.json(
      { error: "Error al eliminar el estudio" },
      { status: 500 }
    );
  }
}