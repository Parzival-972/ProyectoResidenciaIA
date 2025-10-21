import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import connection from "../../../../../libs/connection";
import MedicalStaff from "../../../../models/medicalStaff";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    await connection();

    const user = await MedicalStaff.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Email o contraseña inválida." },
        { status: 404 }
      );
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Email o contraseña inválida." },
        { status: 401 }
      );
    }

    if (!user.isApproved) {
      return NextResponse.json(
        { message: "Tu cuenta no ha sido aprobada" },
        { status: 403 }
      );
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const response = NextResponse.json({
      message: "Login exitoso",
      role: user.role, 
    });

    cookies().set("token", token, {
      httpOnly: true, // No accesible por JavaScript
      secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
      sameSite: "strict", // Protección CSRF
      maxAge: 60 * 60, // 1 hora de duración
      path: "/", // Accesible en toda la app
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { message: "Un error inesperado ha sucedido." },
      { status: 500 }
    );
  }
}