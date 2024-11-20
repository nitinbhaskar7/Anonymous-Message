import {z} from "zod"
export const UsernameSchema = z.string().min(2 , "Username must be atleast 2 characters").max(50 , "Max length of Username is 50").regex(/^[a-zA-Z0-9_]+$/
, {
    message: "Username can only contain letters, numbers, underscores, or hyphens.",
  })
export const signUpSchema = z.object({
    username : UsernameSchema ,
    email : z.string().email({message : "Invalid Email Address"}) ,
    password : z.string().min(6, {message : "Password must be atleast 6 characters"})
}

)