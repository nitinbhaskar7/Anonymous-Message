import userModel from "@/app/model/User";
import { connectDB } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
export async function POST (request){
    const {content , username} = await request.json() ;
    try {
        await connectDB()
        const dbUser = await userModel.findOne({username})
        if(!dbUser){
            return NextResponse.json({
                success: false,
                message: "User not found"
            },
            )
        }
        if(!dbUser.isAcceptingMessages){
            return NextResponse.json({
                success: false,
                message: "User is not accepting messages"
            }
            )
        }
        const newMessage = {
            content : content ,
            createdAt : new Date() 
        }
        dbUser.messages.push(newMessage) ;
        dbUser.save() ;
        return NextResponse.json({
            success: true,
            message: "Message sent successfully"
        },
            { status: 200 }
        )
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        },
            { status: 500 }
        )
    }
}