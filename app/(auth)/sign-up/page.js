"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from "next/link"
import axios from "axios"
import { useDebounce } from "@uidotdev/usehooks"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/app/schemas/signUpSchema"
import { Button } from "@/components/ui/button"
import {useState , useEffect} from "react"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
// Debouncing -> See we need to check if username is already taken or not and display appropriate message by checking in the database but for every keyboard key entered if we check is Username taken then we'll end up making too many requests to the API 
// Therefore we will use a debouncing technique to check after a delay

const page = () => {
    const [username, setusername] = useState('')
    const [usernameMessage, setusernameMessage] = useState('')
    const [isCheckingUsername, setisCheckingUsername] = useState(false)
    const [isSubmitting, setisSubmitting] = useState(false)
    const debouncedUsername = useDebounce(username, 1000); // will get set after 300ms
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            password: "",
            email: ""
        }
    }

    )// form or register is generally used 



    useEffect(() => {
        const checkUserNameUnique = async () => {
            if (debouncedUsername) {
                setisCheckingUsername(true); // we might use a loader while it checks so thats why we are using this state 
                setusernameMessage('') // last time's error in username we should remove 
                try {
                    const response = await axios.get(`/api/checkUniqueUser/?username=${debouncedUsername}`)
                    setusernameMessage(response.data.message);

                } catch (error) {
                    console.log("axios error");
                    setusernameMessage(error.response?.data.message ?? "Error checking username");
                }
                finally {
                    setisCheckingUsername(false)
                }
            }

        }
        checkUserNameUnique()
    }, [debouncedUsername])

    const onSubmit = async (data) => {
        // data is coming from the form(React Hook Forms)
        setisSubmitting(true); // again loader maybe 
        try {
            const response = await axios.post('/api/sign-up', data);
           
            if(response.data.success == false) {
                toast({
                    variant: "destructive",
                    title: "Retry",
                    description: response.data.message
                })
            }
            else{
                toast({
                    title: "Success",
                    description: response.data.message,
                    className: "bg-green-500 text-white"
                })
                router.replace(`/verify/${username}`)
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Failed",
                description: error.message
            })
        }
        finally {
            setisSubmitting(false);
        }
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
            <h1 className="text-center text-2xl font-bold p-3"> Anonymous Feedback</h1>
            <Form {...form}>
                {/* if its register then instead of form use children */}
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        name="username"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <>
                                        <Input
                                            placeholder="John Doe"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setusername(e.target.value);
                                            }}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                        />
                                        {isCheckingUsername && <Loader2 className="animate-spin" />}
                                        <div className={usernameMessage === "Username Available" ? "text-green-500" : "text-red-500"}>
                                            {usernameMessage}
                                        </div>
                                    </>
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="email"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="abc@gmail.com"
                                        {...field}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    />
                                </FormControl>
                             
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="password"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        {...field}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    />
                                </FormControl>
                               
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isSubmitting} className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600">
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin" /> Please wait
                            </>
                        ) : (
                            <>Sign Up</>
                        )}
                    </Button>
                </form>
            </Form>
            <div className="mt-4 text-center">
                Already a member?
                <div>
                    <Button className="mt-2" asChild>
                        <Link href="/sign-in" className="text-blue-500 hover:underline">
                            Sign In
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    </div>
    
    )
}

export default page
