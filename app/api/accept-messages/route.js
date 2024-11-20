import { connectDB } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
// session requires authOptions 
import userModel from "@/app/model/User";
import { NextResponse } from "next/server";

export async function POST(request) {
    await connectDB();
    const { isAccepting } = await request.json();
    const session = await getServerSession(authOptions);
    const user = session.user;
    if (!session || !user) {
        return NextResponse.json({
            success: false,
            message: "Not Logged in"
        },
            { status: 401 }
        )
    }
    const user_id = user._id;
    try {
        const dbUser = await userModel.findByIdAndUpdate(user_id , {isAcceptingMessages : isAccepting } , {new : true }) ;
        if(!dbUser){
            return NextResponse.json({
                success: false,
                message: "User not Found"
            },
                { status: 401 }
            )
        }
        return NextResponse.json({
            success: true,
            message: "Update Success",
            dbUser : dbUser
        },
            { status: 200 }
        )

        
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Failed to update Message status"
        },
            { status: 500 }
        )
    }
}
export async function GET(request){
    await connectDB();
    const session = await getServerSession(authOptions);
    const user = session.user;
    if (!session || !user) {
        return NextResponse.json({
            success: false,
            message: "Not Logged in"
        },
            { status: 401 }
        )
    }
    const user_id = user._id;
    try {
        const dbUser = await userModel.findById(user_id) ;
        if(!dbUser){
            return NextResponse.json({
                success: false,
                message: "User not Found"
            },
                { status: 401 }
            )
        }
        return  NextResponse.json({
            success: true,
            message: "Update Success",
            isAcceptingMessages : dbUser.isAcceptingMessages 
        },
            { status: 200 }
        )
        
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        },
            { status: 500 }
        )
    }
}