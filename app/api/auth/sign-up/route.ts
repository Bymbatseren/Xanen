import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/mongo";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
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

    return NextResponse.json(
      { message: "User created successfully", userId: user._id },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
