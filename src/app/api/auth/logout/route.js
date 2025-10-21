// src/app/api/auth/logout/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = cookies();

    // El método .delete() elimina la cookie por su nombre
    cookieStore.delete("token"); 

    return NextResponse.json({ message: "Cierre de sesión exitoso" }, { status: 200 });
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    return NextResponse.json({ message: "Error al cerrar sesión" }, { status: 500 });
  }
}