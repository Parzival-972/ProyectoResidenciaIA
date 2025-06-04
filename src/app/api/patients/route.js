export const dynamic = "force-dynamic";

import connection from "../../../../libs/connection";
import Patient from "../../../models/patients";

export async function GET(req) {
  try {
    // Connect to MongoDB
    await connection();

    // Extract query parameters
    const {
      search = "",
      page = 1,
      limit = 5,
    } = Object.fromEntries(req.nextUrl.searchParams);

    // Build the search query
    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    // Pagination and query
    const totalPatients = await Patient.countDocuments(query);
    const patients = await Patient.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Calculate total pages
    const totalPages = Math.ceil(totalPatients / limit);

    // Return the data as a response
    return new Response(JSON.stringify({ patients, totalPages }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al conseguir pacientes:", error);
    return new Response(
      JSON.stringify({
        message: "Error al conseguir pacientes",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
