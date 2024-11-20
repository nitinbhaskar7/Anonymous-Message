"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignInSchema } from "@/app/schemas/SignInSchema"
import { signIn } from "next-auth/react"

const page = () => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues : {
      identifier : "" ,
      password : ""
    }
  }

  )// form or register is generally used 





  const onSubmit = async (data) => {
    // data is coming from the form(React Hook Forms)
    try {
      const response = await signIn("credentials", {
        redirect: false,
        // we are handling the redirect by ourselves 
        identifier: data?.identifier,
        password: data?.password,
      })


      if (response?.error) {
        toast({
          title: "Failed",
          description: "Incorrect Email/Username or Password",
          variant: "destructive",
        })
      }
      if (response?.url) {
        // means successfull sign In
        // generally response.url is the url nextauth will redirect to but we are redirecting to by ourselves
        console.log(response.url);
        toast({
          title: "Success",
          description: "User Signed In",
          className: "bg-green-500 text-white"
        })
        router.replace(`/dashboard`)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed",
        description: error.message
      })
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
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <>
                      <Input
                        placeholder="johndoe@gmail.com"
                        {...field}
                       
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    
                    </>
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
            <Button type="submit" className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600" >
             Sign In
            </Button>
          </form>
        </Form>
        
      </div>
    </div>

  )
}

export default page
