import { NextResponse } from "next/server";

// 1. USA TUS PROPIOS ARCHIVOS (Ajusta los ../ según la profundidad de tu carpeta)
// Si estás en src/app/api/diagnostico/route.js, usualmente necesitas bajar 3 niveles:
import ClinicalDiagnosis from "../../../models/clinicalDiagnosis";
import connection from "../../../../libs/connection";

const NEURO_API_URL = process.env.NEURO_API_URL || "http://127.0.0.1:8000";

export async function POST(request) {
  try {
    // 2. CONECTAR A LA BD (Usando tu función 'connection')
    await connection(); 

    const body = await request.json();
    
    const { fileUrl, modeloId, pacienteId, estudioId, nombreProfesional } = body;

    if (!fileUrl || !modeloId) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 });
    }

    // --- Lógica de descarga y envío a la IA ---
    const imageResponse = await fetch(fileUrl);
    if (!imageResponse.ok) throw new Error("No se pudo descargar la imagen original");
    const imageBlob = await imageResponse.blob();

    const formData = new FormData();
    formData.append("paciente", pacienteId);
    formData.append("file", imageBlob, "imagen_diagnostico.jpg"); 

    console.log(`📡 Enviando a NeuroAPI: ${NEURO_API_URL}/diagnosticar/${modeloId}`);
    
    const aiResponse = await fetch(`${NEURO_API_URL}/diagnosticar/${modeloId}`, {
      method: "POST",
      body: formData,
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      throw new Error(`Error en NeuroAPI: ${errorText}`);
    }

    const resultadoIA = await aiResponse.json();    
    const datosParaFrontend = resultadoIA.resultado ? resultadoIA.resultado : resultadoIA;

    // --- 3. GUARDADO AUTOMÁTICO (Usando tu modelo ClinicalDiagnosis) ---
    try {
      // No necesitamos llamar connectDB() aquí porque ya llamamos await connection() al inicio
      
      await ClinicalDiagnosis.create({
        userId: pacienteId,
        profesional: nombreProfesional || "Sistema", 
        medicalImage: estudioId, 
        diagnosticoIA: datosParaFrontend.diagnostico,
        nivelCerteza: datosParaFrontend.nivel_de_certeza,
        modeloUsado: modeloId,
        esCorrecto: null
      });

      console.log("✅ Diagnóstico guardado en historial.");

    } catch (dbError) {
      console.error("⚠️ Error guardando en DB (No afecta al usuario):", dbError.message);
    }

    return NextResponse.json(datosParaFrontend);

  } catch (error) {
    console.error("Error en el puente de diagnóstico:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function PATCH(request) {
  try {
    await connection(); // Conectar a BD
    
    const body = await request.json();
    const { id, esCorrecto } = body; // Recibimos el ID del diagnóstico y el nuevo estado

    if (!id) {
      return NextResponse.json({ error: "Falta el ID del diagnóstico" }, { status: 400 });
    }

    // Actualizamos solo el campo 'esCorrecto'
    const diagnosticoActualizado = await ClinicalDiagnosis.findByIdAndUpdate(
      id,
      { esCorrecto: esCorrecto },
      { new: true } // Para devolver el documento actualizado
    );

    if (!diagnosticoActualizado) {
      return NextResponse.json({ error: "Diagnóstico no encontrado" }, { status: 404 });
    }

    return NextResponse.json(diagnosticoActualizado);
  } catch (error) {
    console.error("Error actualizando validación:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}