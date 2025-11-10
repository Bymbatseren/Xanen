import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/mongo";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Бүх талбар шаардлагатай" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Та бүртгэлтэй байна. Нэвтэрч орно уу!" },
        { status: 400 }
      );
    }
    const existingUserByUsername = await User.findOne({ username });
if (existingUserByUsername) {
  return NextResponse.json({ error: "Хэрэглэгчийн нэр аль хэдийн ашиглагдсан байна" }, { status: 400 });
}


    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

      const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" } 
    );
        const response = NextResponse.json({
      message: "Хэрэглэгч амжилттай үүслээ",
      userId: user._id,
    });
     response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

      return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Алдаа гарлаа" },
      { status: 500 }
    );
  }
}