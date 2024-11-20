"use client"
import React from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { ex_messages } from '@/examples/messages'
const page = () => {
  const [emblaRef] = useEmblaCarousel({ loop: false }, [Autoplay()])
  return (
    <>
    <div className='text-center p-2'>
      <h1 className='text-4xl font-bold text-center'> 
        Anonymous Feedback
      </h1>
      <div className='text-xl'>
        Your place to put what's on your head about others without them knowing your name
      </div>
   
      <div className='p-10'>
      <Carousel className="w-full max-w-xs m-auto"    plugins={[
        Autoplay({
          delay: 2000,
          stopOnMouseEnter : true ,
          stopOnInteraction : false ,
        }),
      ]}>
      <CarouselContent>
        {ex_messages.map((message, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardHeader className="text-4xl font-semibold">
                  {message.username} Says 
                </CardHeader>
                <CardContent className="flex flex-col gap-4 aspect-square items-center justify-center p-6">
                  <div className="text-2xl font-semibold">{message.content}</div>
                  <div> {message.postedAt} </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
      </div>
    </div>
    </>
  )
}

export default page
