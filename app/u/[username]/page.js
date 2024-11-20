"use client"
import React, { useState, useEffect } from 'react'
import { Textarea } from "@/components/ui/textarea"
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { MessageSchema } from '@/app/schemas/MessageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'
import { useCompletion } from 'ai/react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { useToast } from '@/hooks/use-toast'
import { samplquestions } from '@/examples/sampleQuestions'

const page = ({ params }) => {
  const [isSubmitting, setisSubmitting] = useState(false)
  const [questions, setquestions] = useState([])
  const { toast } = useToast()
  const form = useForm({
    resolver: zodResolver(MessageSchema),
    defaultValues: {
      content: ""
    }
  });
  const {setValue, register} = form

  const { completion, handleSubmit } = useCompletion({
    streamProtocol: 'data', // optional, this is the default
    api: "/api/suggest-messages",
    initialInput: " "
  });

  useEffect(() => {
    if(completion.length != 0){
      setquestions(completion.split("||"))
    }
  }, [completion])

  const onSubmit = async (data) => {
    setisSubmitting(true)
    try {
      const response = await axios.post("/api/sendMessage", {
        username: params.username,
        content: data.content
      })
      if (response.data.success === true) {
        toast({
          title: "Success",
          description: "Message sent successfully",
          className: "bg-green-500 text-white"
        })
      } else {
        toast({
          title: "Failed",
          description: response.data.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      })
    } finally {
      setisSubmitting(false)
    }
  }

  return (
    <div className='flex items-center justify-center h-screen bg-gray-50'>
      <div className="w-[40vw] bg-white p-10 rounded-xl shadow-lg transition-all hover:shadow-2xl transform hover:scale-[1.02]">
        <h1 className="text-center text-3xl font-bold text-gray-700 mb-6">Enter Your Message</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <input
                      {...register("content")}

                      placeholder="Type your message here..."
                      className="w-full text-lg p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" /> Sending...
                </>
              ) : (
                <>Send Message</>
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-8">
          <form onSubmit={handleSubmit}>
            <Button type="submit" className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all py-2 px-4 rounded-lg">
              Suggest Messages
            </Button>

            <div className="mt-4 flex flex-col gap-2">
              {questions.length ==0 ? 
                 samplquestions.map((question, index) => (
                  <Button
                  type="button"
                    key={index}
                    variant="outline"
                    className="py-2 border h-fit w-fit border-gray-300 text-gray-600 hover:bg-gray-100 transition-all"
                    onClick = {(e)=>{setValue("content"  , question)}}
                  >
                    {question}
                  </Button>
                 ))
               : questions.map((question, index) => (
                <Button
                type="button"
                  key={index}
                  variant="outline"
                  className="py-2 border h-fit w-fit border-gray-300 text-gray-600 hover:bg-gray-100 transition-all"
                  onClick = {(e)=>{setValue("content"  , question)}}
                >
                  {question}
                </Button>
              ))}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default page
