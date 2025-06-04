import connection from "../../../../../../libs/connection";
import MedicalForm from "../../../../../models/medicalStudy";

// Handle PUT request - Update or create a patient record
export async function PUT(req, { params }) {
  const { id } = params;

  try {
    // Connect to the database
    await connection();

    // Parse the request body
    const data = await req.json();

    // Validate required fields
    const requiredFields = ["nombre", "edad", "peso", "altura"];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({
          message: `Faltan los siguientes campos: ${missingFields.join(", ")}`,
        }),
        { status: 400 }
      );
    }

    // Additional validation (optional, adjust as needed)
    if (data.edad < 0) {
      return new Response(
        JSON.stringify({ message: "Edad tiene que ser un número positivo" }),
        { status: 400 }
      );
    }
    if (data.peso <= 0 || data.altura <= 0) {
      return new Response(
        JSON.stringify({
          message: "Peso y altura deben ser números positivos",
        }),
        { status: 400 }
      );
    }

    // Find the patient by ID and update or create a new record if not found
    const updatedPatient = await MedicalForm.findByIdAndUpdate(
      id,
      { $set: data }, // Update with new data
      { new: true, upsert: true, runValidators: true } // Create if not found
    );

    // Return the updated patient record
    return new Response(
      JSON.stringify({
        message: "Se actualizó correctamente el usuario",
        updatedPatient,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    // Handle errors and return a 500 status
    console.error("Error al actualizar paciente:", error);
    return new Response(
      JSON.stringify({
        message: "Error al actualizar paciente",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}