import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
export const getUser = async ()=>{

    const user = await getServerSession(authOptions) ;
    return user 
}