import { NextResponse } from "next/server";

// URL de tu NeuroAPI (En local es localhost:8000, en AWS será la URL de Lambda/EC2)
const NEURO_API_URL = process.env.NEURO_API_URL || "http://127.0.0.1:8000";

export async function POST(request) {
  try {
    const body = await request.json();
    const { fileUrl, modeloId, pacienteId } = body;

    if (!fileUrl || !modeloId) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 });
    }

    // 1. Descargar la imagen desde S3 (o donde esté alojada)
    const imageResponse = await fetch(fileUrl);
    if (!imageResponse.ok) throw new Error("No se pudo descargar la imagen original");
    const imageBlob = await imageResponse.blob();

    // 2. Preparar el formulario para enviar a NeuroAPI
    const formData = new FormData();
    formData.append("paciente", pacienteId);
    formData.append("file", imageBlob, "imagen_diagnostico.jpg"); 

    // 3. Llamar a NeuroAPI (Tu API de Python)
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
    
    // --- DEBUGGING CRÍTICO ---
    console.log("🤖 Respuesta recibida de NeuroAPI:", resultadoIA);
    // -------------------------

    // ADAPTACIÓN: La API de Python devuelve los datos anidados dentro de "resultado".
    // El frontend espera { diagnostico: "...", nivel_de_certeza: ... } directamente.
    // Extraemos la propiedad 'resultado' si existe, para devolver una estructura plana.
    const datosParaFrontend = resultadoIA.resultado ? resultadoIA.resultado : resultadoIA;

    // 5. Devolver resultado al Frontend
    return NextResponse.json(datosParaFrontend);

  } catch (error) {
    console.error("Error en el puente de diagnóstico:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}