"use client"
import { useToast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useCallback, useState, useEffect } from 'react'
import { acceptMessageSchema } from '../schemas/acceptMessageSchema'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label' // Import Label component
import { Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
const page = () => {
  const [messages, setmessages] = useState([])
  const [isLoading, setisLoading] = useState(false)
  const [isSwitchLoading, setisSwitchLoading] = useState(false)
  const { toast } = useToast()
  const [isDeleteConfirm, setisDeleteConfirm] = useState(false);

  const handleDeleteMessageBackend = async (messageID) => {
    handleDeleteMessage(messageID);
    try {
      const response = await axios(`/api/delete-message/${messageID}`);
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Deleted Message Successfully",
          className: "bg-green-500 text-white"
        })
      }
      else {
        toast({
          title: "Failed",
          description: response.data.message,
          variant: "destructive"
        })
      }
    }
    catch (error) {
      toast({
        title: "Failed",
        description: "Server Error Try Again",
        variant: "destructive"
      })
    }

  }



const handleDeleteMessage = (messageID) => {
  // See here each message itself is a JSON MongoDB object 
  // So let's breakdown one thing 
  // See each user has a messages field in the database which contains documents(Mongo DB documents) of the Schema of Messages therefore it also has _id
  console.log(messageID)
  setmessages(messages.filter((message) => {
    return message._id != messageID
  }))
  setisDeleteConfirm(true);
}

const { data: session } = useSession();

const form = useForm({
  resolver: zodResolver(acceptMessageSchema)
})
const { register, watch, setValue } = form

const acceptMessages = watch('isAccepting')

const fetchAcceptMessage = useCallback(async () => {
  setisSwitchLoading(true);
  try {
    const response = await axios.get("/api/accept-messages")
    setValue('isAccepting', response.data.isAcceptingMessages)
  } catch (error) {
    toast({
      title: "Failed",
      description: "Failed to fetch",
      variant: "destructive"
    })
  }
  finally {
    setisSwitchLoading(false)
  }
}, [setValue, setisSwitchLoading])

const fetchMessages = useCallback(async (refresh = false) => {
  setisLoading(true);
  try {
    const response = await axios.get("/api/get-messages");
    setmessages(response.data.messages || [])
    toast
    if (refresh) {
      toast({
        title: "Success",
        description: "Updated Messages",
      })
    }
  } catch (error) {
    toast({
      title: "Failed",
      description: error.toString(),
      variant: "destructive"
    })
  }
  finally {
    setisLoading(false);
  }
}, [setisLoading, setmessages])

useEffect(() => {
  if (!session || !session.user) {
    toast({
      title: "Failed",
      description: "Login First",
      variant: "destructive"
    })
    return;
  }
  fetchMessages();
  fetchAcceptMessage();

}
  , [session, setValue])



const handleSwtichChange = async () => {
  try {
    const response = await axios.post('/api/accept-messages', {
      isAccepting: !acceptMessages
    })
    setValue('isAccepting', !acceptMessages)
    toast({
      title: "Success",
      description: response.data.message
    })
  } catch (error) {
    toast({
      title: "Failed",
      description: "Failed to update settings",
      variant: "destructive"
    })
  }
}

if (!session || !session.user) {
  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg text-gray-500">Please login to access your messages.</p>
    </div>
  )
}

const profileURL = `${window.location.protocol}/${window.location.host}/u/${session.user.username}`;

return (
  <div className="max-w-3xl mx-auto p-6 space-y-8 bg-gray-100 rounded-lg shadow-lg">




    <Card className="bg-white shadow-md rounded-lg">
      <CardHeader className="border-b">
        <CardTitle className="text-xl font-semibold text-gray-700">Share Your Anonymous Message Link</CardTitle>
      </CardHeader>
      <CardContent className="py-6">
        <div className="flex items-center space-x-4">
          <Input value={profileURL} readOnly className="w-full bg-gray-100 border-gray-300 rounded-lg px-4 py-2 text-gray-600 focus:outline-none" />
          <Button variant="outline" onClick={() => {
            navigator.clipboard.writeText(profileURL);
            toast({
              title: "Success",
              description: 'URL copied to Clipboard',
              className: "bg-green-500 text-white"
            })
          }}>
            Copy
          </Button>
        </div>

        <div className="flex items-center space-x-2 mt-4">
          <Label htmlFor="acceptMessagesSwitch" className="text-gray-600">Accepting Messages:</Label>
          <Switch
            id="acceptMessagesSwitch"
            {...register("isAccepting")}
            checked={acceptMessages}
            onCheckedChange={() => { handleSwtichChange() }}
            className={`${acceptMessages ? 'bg-green-500' : 'bg-red-500'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300`}
          >
            <span
              className={`${acceptMessages ? 'translate-x-6 bg-blue-500' : 'translate-x-1 bg-yellow-500'
                } inline-block h-4 w-4 transform rounded-full transition`}
            />
          </Switch>
        </div>
      </CardContent>
    </Card>

    <Card className="bg-white shadow-md rounded-lg">
      <CardHeader className="border-b">
        <CardTitle className="text-xl font-semibold text-gray-700">Received Anonymous Messages</CardTitle>
      </CardHeader>
      <CardContent className="py-6 space-y-4">
        {messages.length ? (
          messages.map((message, index) => (
            <Card key={message._id} className="border rounded-lg p-4 bg-gray-50">
              <CardContent className="text-gray-700 flex justify-between" >
                {message.content}
                <AlertDialog>
                  <AlertDialogTrigger className='bg-red-500 hover:bg-red-700 p-2 rounded-sm'>
                    <Trash2 className='size-4 text-white' />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your message
                        and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => { handleDeleteMessageBackend(message._id) }}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
              <CardFooter className="text-right text-sm text-gray-500">{
                new Date(message.createdAt).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: 'numeric',
                }
                )
              }
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="text-gray-500">No messages received yet.</p>
        )}
      </CardContent>
    </Card>
  </div>
)
}

export default page;
