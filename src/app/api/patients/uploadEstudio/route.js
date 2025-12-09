// CÓDIGO ANTIGUO SIN USO. 
// ANTES SE UTILIZABA PARA LA VENTANA EstudiosTab.jsx 
// SU FUNCIONAMIENTO SE MIGRÓ A patients/[id]/estudios/route.js 
import { NextResponse } from "next/server";
import connection from "../../../../../libs/connection";
import MedicalImage from "../../../../models/medicalImage";

export async function POST(request) {
  try {
    await connection();
    const body = await request.json();

    const { userId, fileName, fileSize, fileUrl, tipoDeEstudio, subidoPor } = body;

    if (!userId || !fileName || !fileUrl || !tipoDeEstudio) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const newEstudio = new MedicalImage({
      userId,
      fileName,
      fileSize,
      fileUrl,
      tipoDeEstudio,
      subidoPor,
    });

    await newEstudio.save();

    return NextResponse.json(newEstudio, { status: 201 });
  } catch (error) {
    console.error("Error al guardar el estudio:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al guardar el estudio" },
      { status: 500 }
    );
  }
}