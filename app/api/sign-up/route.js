import { NextResponse } from "next/server";
import {connectDB} from '@/lib/dbConnect'
import UserModel from "@/app/model/User"
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/app/helpers/sendverificationEmail";
export async function POST(request) {
    await connectDB()
    try {
        let verifyCode = 0;
        const { username, email, password } = await request.json();
        const existingUser = await UserModel.findOne({ username: username, isVerified: true })
        if (existingUser) {
            return NextResponse.json({ success: false, message: "Username exists already" })
        }
        const existingUserEmail = await UserModel.findOne({ email: email })
        if (existingUserEmail) {
            // User Exists but not verified 
            const hashedPass = await bcrypt.hash(password, 10)
            const expiryDate = new Date();
            verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
            expiryDate.setHours(expiryDate.getHours() + 1)
            existingUserEmail.username = username;
            existingUserEmail.password = hashedPass
            existingUserEmail.verifyCodeExpiry = expiryDate;
            existingUserEmail.verifyCode = verifyCode;
            existingUserEmail.isVerified = false 
            await existingUserEmail.save()
        }
        else {
            const hashedPass = await bcrypt.hash(password, 10)
            const expiryDate = new Date();
            verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
            expiryDate.setHours(expiryDate.getHours() + 1)
            const newUser = new UserModel({
                username: username,
                email: email,
                password: hashedPass,
                verifyCode: verifyCode,
                isVerified: false,
                verifyCodeExpiry: expiryDate,
                isAcceptingMessages: true,

            })
            await newUser.save()
        }
        const emailRes = await sendVerificationEmail(email, username, verifyCode)
        if (!emailRes.success) {
            return NextResponse.json({
                success: false,
                message: emailRes.message
            }, { status: 500 }
            )
        }
        else {
            return NextResponse.json({
                success: true,
                message: emailRes.message
            }, { status: 201 }
            )
        }
    } catch (error) {
        console.log("Error Registering User", error)
        return NextResponse.json({ success: false, message: "Error Registering User" })
    }

}