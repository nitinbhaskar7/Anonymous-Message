import {z} from 'zod'

export const MessageSchema = z.object({
    content : z.string().min(5 , "Enter atleast 5 characters").max(300) 
})