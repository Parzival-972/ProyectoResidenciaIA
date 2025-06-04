import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import connection from "../../../../../libs/connection";
import MedicalStaff from "../../../../models/medicalStaff";

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

    return NextResponse.json({
      message: "Login exitoso",
      token,
      role: user.role,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { message: "Un error inesperado ha sucedido." },
      { status: 500 }
    );
  }
}
