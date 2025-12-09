import { NextResponse } from "next/server";
import connection from "../../../../../../libs/connection";
import ClinicalDiagnosis from "../../../../../models/clinicalDiagnosis";
import MedicalImage from "../../../../../models/medicalImage"; // Importar para que el populate funcione

export async function GET(request, { params }) {
  try {
    await connection();
    const { id } = params; // El ID del paciente

    const diagnosticos = await ClinicalDiagnosis.find({ userId: id })
      .sort({ createdAt: -1 }) // Los más recientes primero
      .populate("medicalImage", "fileName tipoDeEstudio fileUrl"); // Traemos datos de la imagen

    return NextResponse.json(diagnosticos);
  } catch (error) {
    console.error("Error obteniendo historial:", error);
    return NextResponse.json(
      { error: "Error al cargar el historial de diagnósticos" },
      { status: 500 }
    );
  }
}