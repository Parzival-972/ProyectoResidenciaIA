import connection from "../../../../libs/connection";
import MedicalForm from "../../../models/medicalStudy";

// Handle GET request - Fetch all records from MedicalForm collection
export async function GET(req) {
  try {
    // Connect to the database
    await connection();

    // Fetch all records
    const medicalData = await MedicalForm.find({}).lean(); // Use `lean()` for better performance

    // Return the data
    return new Response(JSON.stringify(medicalData), { status: 200 });
  } catch (error) {
    // Handle errors
    console.error("Error al conseguir datos médicos:", error);
    return new Response(
      JSON.stringify({
        message: "Error al conseguir datos médicos",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
