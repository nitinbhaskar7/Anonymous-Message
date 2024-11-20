'use client'
import React from 'react'
import axios from 'axios'
import { verifySchema } from '@/app/schemas/verifySchema'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"

const page = ({ params }) => {
    const router = useRouter();
    const { username } = params
    const {toast} = useToast()

    const form = useForm({
        resolver: zodResolver(verifySchema),
    })


    const onSubmit = async (data) => {
        const code = data.code;
        console.log(code)
        try {
            const res = await axios.post("/api/verifyCode", {
                username: username,
                code: code
            })
            if (res.data.success == true) {
                toast({
                    title: "Success",
                    description: res.data.message,
                    className: "bg-green-500 text-white"
                })
                router.replace("/sign-in")
            }
            else {
                toast({
                    title: "Failed",
                    description: res.data.message,
                    variant: "destructive"
                })

            }
        }
        catch (error) {
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
            <Form {...form}>
                {/* if its register then instead of form use children */}
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        name="code"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Verification Code</FormLabel>
                                <FormControl>
                                    <>
                                        <InputOTP maxLength={6} {...field}>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup>
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>

                                    </>
                                </FormControl>
                              
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600">
                            Verify Code
                    </Button>
                </form>
            </Form>
        </div>
        </div>
    )
}

export default page
