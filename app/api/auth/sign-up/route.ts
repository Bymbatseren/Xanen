import { NextRequest,NextResponse } from "next/server";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/mongo"
import User from "@/models/User"
 export async function POST (req:NextRequest){
    await dbConnect()
    const {username,email,password}=await req.json()
    const existingUser= await User.findOne({email})
    if(existingUser){
        return NextResponse.json({error:"User already exists"},{status:400})
    }
    const hashedPassword= await bcrypt.hash(password,10)
    const user= await User.create({
        username,
        email,
        password:hashedPassword

    })
    return NextResponse.json({ message:"user created successfully ", userId:user._id},{status:201})
 }