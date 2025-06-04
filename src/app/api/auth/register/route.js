import { NextResponse } from "next/server";
import MedicalStaff from "../../../../models/medicalStaff";
import connection from "../../../../../libs/connection";

export async function POST(request) {
  try {
    await connection();

    const { role, name, email, password, id } = await request.json();

    if (!role || !name || !email || !password || !id) {
      return NextResponse.json(
        { message: "Todos los campos son requeridos." },
        { status: 400 }
      );
    }

    const existingUser = await MedicalStaff.findOne({
      $or: [{ email }, { id }],
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email o ID ya existente." },
        { status: 400 }
      );
    }

    const newUser = new MedicalStaff({
      role,
      name,
      email,
      password, // The pre-save hook will hash this password
      id,
    });

    await newUser.save();

    return NextResponse.json({ message: "Usuario registrado exitosamente." });
  } catch (error) {
    console.error("Error de Registro:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Se detectó una entrada duplicada." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Ha sucedido un error inesperado." },
      { status: 500 }
    );
  }
}
