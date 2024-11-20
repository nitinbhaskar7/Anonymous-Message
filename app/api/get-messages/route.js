import { connectDB } from "@/lib/dbConnect";
import userModel from "@/app/model/User";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
export async function GET(request) {
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
    // Remember we converted _id to String 
    // in session therefore while doing aggregation sometimes it gives error as it wants Object ID 
    const userID = new mongoose.Types.ObjectId(user_id)  ; // conerting to objectID 
    try {
        // const dbUser = await userModel.aggregate([
        //     { $match: { id: userID } },
        //     { $unwind: '$messages' },
        //     { $sort: { 'messages.createdAt': -1 } },
        //     { $group: {_id : '$_id' , messages : {$push : "$messages"}}}
        // ])
        const dbUser = await userModel.findById(user_id) ;

        if(!dbUser){
            return NextResponse.json({
                success: false,
                message: "User not found"
            },
                { status: 403 }
            )
        }
        return NextResponse.json({
            success: true,
            messages : dbUser.messages 
        },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json({
            success : false ,
            message : "Internal Server Error"
        })

    }
}