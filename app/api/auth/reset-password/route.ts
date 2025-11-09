import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongo";
import User from "@/models/User";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";

export async function POST(req:Request){
    try{
        await dbConnect();
        const {token,newPassword} = await req.json()
         

        const decoded:any=jwt.verify(token,process.env.JWT_SECRET!);
        const user =await User.findOne({email:decoded.email})
        if(!user){
            return NextResponse.json({error:"Хэрэглэгч олдсонгүй"}, {status:400})
        }

        const hashed=await bcrypt.hash(newPassword,10);
        user.password=hashed;
        await user.save();
        return NextResponse.json({message:"Нууц үг амжилттай шинэчлэгдлээ"})

    } catch(err){
        console.error("Нууц үг сэргээх явцад алдаа гарлаа:", err);
    }
}