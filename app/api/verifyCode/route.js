import { connectDB } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { verifySchema } from "@/app/schemas/verifySchema";
import { z } from "zod";
import { UsernameSchema } from "@/app/schemas/signUpSchema";
import userModel from "@/app/model/User";

export async function POST(request) {
    await connectDB() ;
    try {
        const {username , code} = await request.json() 
        const decodedUsername  = decodeURIComponent(username)// just playing safe mostly it is not decoded in URI like %20
        const dbUser = await userModel.findOne({username : decodedUsername}) ;
        if(!dbUser){
            return NextResponse.json({success : false  , message : "User not found"} )
        }
        console.log(typeof(code))
        const checkCode = verifySchema.safeParse({code : ""+code})
        if(!checkCode.success){
            return NextResponse.json({success : false  , message : checkCode.error.format()._errors} )
        }
       const checkCodeCorrect = dbUser.verifyCode == code && dbUser.verifyCodeExpiry > Date.now() 
        if(!checkCodeCorrect){
            return NextResponse.json({success : false  , message : "Incorrect Code or Expired"} )
        }
        dbUser.isVerified = true ;
        await dbUser.save()
        return NextResponse.json({success : true , message : "User Verified"})

    } catch (error) {
        console.log(error)
        return NextResponse.json({success : false  , message : "Error"} )
    }
}