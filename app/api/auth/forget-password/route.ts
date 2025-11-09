import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongo";
import User from "@/models/User";
import nodemailer from "nodemailer";

export async function POST(req:Request){
    try{
        await dbConnect();
    const {email} = await req.json()
    const user =await User.findOne({email})
    if(!user){
        return NextResponse.json({error:"Э-мэйл хаяг бүртгэлгүй байна"}, {status:400})
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires =new Date(Date.now() + 15 * 60 *1000)
    user.otp=otp
    user.otpExpires=otpExpires
    await user.save()
    const transporter =nodemailer.createTransport({
        service:"Gmail",
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS,
        }
    })
    const mailOptions ={
        from :process.env.EMAIL_USER,
        to:email,
        subject:"Нууц үг сэргээх OTP код",
        text:`Таны OTP код: ${otp}. Энэ код 15 минутын дараа дуусна.`

    }
    await transporter.sendMail(mailOptions)
    return NextResponse.json({message:"OTP код амжилттай илгээлээ"})
    } catch(err){
        console.error("Нууц үг сэргээх явцад алдаа гарлаа:", err);
    }
}