// src/app/api/patients/uploadImage/route.js
import { NextResponse } from "next/server";
import diagnosisAP from "../../../../models/diagnosisAP"; // Update the path as per your project structure
import connection from "../../../../../libs/connection"; // Import your database connection utility

export async function POST(request) {
  try {
    await connection(); // Make sure to connect to the database

    const body = await request.json();
    const { userID, diseaseName, similarityPercentage, imageUrl } = body;

    // Create a new diagnosis record in MongoDB
    const newDiagnosis = await diagnosisAP.create({
      userID,
      diseaseName,
      similarityPercentage,
      imageUrl,
    });

    return NextResponse.json(newDiagnosis, { status: 201 });
  } catch (error) {
    console.error("Error al guardar diagnóstico:", error);
    return NextResponse.json(
      { error: "Error al guardar diagnóstico" },
      { status: 500 }
    );
  }
}