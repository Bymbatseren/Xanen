import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect("/signin");
  }

  try {
    jwt.verify(token, JWT_SECRET);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.redirect("/signin");
  }
}
