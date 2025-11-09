import { NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/lib/mongo";
import jwt from "jsonwebtoken";

export async function POST(req:Request){
    try{
        await dbConnect();
        const {email,otp} = await req.json()
        const user =await User.findOne({email})
        if(!user){
            return NextResponse.json({error:"Э-мэйл хаяг бүртгэлгүй байна"}, {status:400})

        }
        if(user.otp !== otp){
            return NextResponse.json({error:"OTP код буруу байна"}, {status:400})
    }
    if(user.otpExpires < new Date()){
        return NextResponse.json({error:"OTP код дууссан байна"}, {status:400})
    }
    const resetToken = jwt.sign({email},process.env.JWT_SECRET!,{expiresIn:"10m"})

    user.otp=undefined
    user.otpExpires=undefined
    await user.save()
    return NextResponse.json({message:"OTP амжилттай баталгаажлаа", resetToken})

}
catch(err){
    console.error("OTP баталгаажуулах явцад алдаа гарлаа:", err);
} } 