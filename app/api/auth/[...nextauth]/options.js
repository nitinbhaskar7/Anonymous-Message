import CredentialsProvider from "next-auth/providers/credentials"
import { nextAuthOptions } from "next-auth"
import { connectDB } from "@/lib/dbConnect"
import bcrypt from 'bcryptjs'
import userModel from "@/app/model/User"
export const authOptions = {

    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Credentials',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: { label: "Email/Username", type: "text", placeholder: "jsmith@gmail.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    await connectDB();
                    const user = await userModel.findOne({
                        $or: [
                            { email: credentials?.identifier },
                            { username: credentials?.identifier }
                        ]
                    })
                    if (!user) {
                        throw new Error("No user found ")
                    }
                    if (!user.isVerified) {
                        throw new Error("Not verified")
                    }
                    const correctPass = await bcrypt.compare(credentials?.password, user.password)
                    if (correctPass) {
                        return user; // from db
                    }
                    else {
                        throw new Error("Incorrect Password")
                    }

                } catch (error) {
                    throw new Error("Unable to connect" + err)
                }
            }

        })],
    // pages: {
    //     signIn: "/sign-in"
    // },
    session: {
        strategy: "jwt",
    },
    
    
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token
        },
        async session({ session,token }) {
            // user is the user returned from authorize 
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session
        }
    },
    secret: process.env.NEXT_AUTH_SECRET,
    
}
