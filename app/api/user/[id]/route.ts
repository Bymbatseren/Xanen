import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongo";
import User from "@/models/User";


export async function PATCH(req: Request, context: { params: any }) {
  try {
    await dbConnect();

    const { id } = await context.params;;
    console.log("Received ID:", id);
    const {avatar,phone,bio} = await req.json();
       const user= await User.findById(id);
       if(!user){
        return NextResponse.json({error:"User not found"},{status:404});
       }
        user.avatar=avatar || user.avatar;
        user.phone=phone || user.phone;
        user.bio=bio || user.bio;
        await user.save();

      return NextResponse.json({message:"Profile updated successfully"},{status:200});

  } 
 
    
    catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }

    
    
    
}
