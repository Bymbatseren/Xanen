import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongo";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    return NextResponse.json({ message: "MongoDB connected successfully!" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to connect MongoDB", details: err });
  }
}
