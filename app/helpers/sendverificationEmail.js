import { resend } from "@/lib/resend";
import VerificationEmail from "@/emails/VerificationEmail"; 

export async function sendVerificationEmail(email  , username , verifyCode) {
    // sending an email is async as it can take time and also erros might be common
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification Code Email',
            react: <VerificationEmail username={username} otp={verifyCode}   /> ,
          });
        return { success : true , message : "Verification Email sent Successfully" }
    } catch (error) {
        console.log("Error sending Email" , error) 
        return {success : false , message : "Failed to Send Email"}
    }
}