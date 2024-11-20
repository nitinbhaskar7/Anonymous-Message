import { connectDB } from "@/lib/dbConnect";
import userModel from "@/app/model/User";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
export async function GET(request, { params }) {
    const messageid = params.messageid;
    console.log(messageid)
    const session = await getServerSession(authOptions);

    try {
        await connectDB();
        const updatedUser = await userModel.updateOne({
            _id: session.user._id,
        }, {
            $pull: { messages: { _id: messageid } }
        }
        )
        if(updatedUser.modifiedCount === 0){
            return NextResponse.json({
                success: false,
                message: "Message not found"
            })
        }
        return NextResponse.json({
            success: true,
            message: "Message Deleted"
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        }, {status : 500})
    }
    
}