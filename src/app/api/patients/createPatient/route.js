import connection from "../../../../../libs/connection"; // Import Mongoose connection
import Patient from "../../../../models/patients"; // Import the Patient model

// Define the POST method for handling patient creation
export async function POST(req) {
  try {
    // Connect to the database
    await connection();

    // Parse the incoming JSON request body
    const formData = await req.json();

    // Create a new patient using the Patient model
    const newPatient = new Patient(formData);

    // Save the patient in the database
    const savedPatient = await newPatient.save();

    // Return a success response with the saved patient data
    return new Response(JSON.stringify({ success: true, savedPatient }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al añadir paciente:", error);

    // Return an error response
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}