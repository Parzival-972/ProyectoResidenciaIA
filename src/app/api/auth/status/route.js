import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return NextResponse.json({ isAuthenticated: false }, { status: 200 });
  }

  try {
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    return NextResponse.json({
      isAuthenticated: true,
      userId: decoded.userId,
      role: decoded.role,
      email: decoded.email,
    });
  } catch (error) {
    return NextResponse.json({ isAuthenticated: false }, { status: 200 });
  }
}