import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect"; 
import userModel from "@/app/model/User";
import { z } from "zod";
import { UsernameSchema} from "@/app/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username : UsernameSchema
})
export async function GET(request) {
    await connectDB() ;
    try {
        const {searchParams} = new URL(request.url) ;
        const queryParam = {
            username : searchParams.get("username")
        }
        const res = UsernameQuerySchema.safeParse(queryParam)
        if(!res.success){
            const error = res.error.format().username._errors

            return NextResponse.json({success : false , message : error})
        }
        const {username} = res.data ;
        const isUsernamePresent = await userModel.findOne({username : username ,  isVerified : true })
        if(isUsernamePresent){
            return NextResponse.json({success : false , message : "Username Taken"})
        }
        else{
            return NextResponse.json({success : true , message : "Username Available"})
    
        }

    } catch (error) {
        console.log(error)
        return NextResponse.json({success : false  , message : "Error checking username"} )
    }
}