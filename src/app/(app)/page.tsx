'use client'
import React from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import AutoPlay from "embla-carousel-autoplay"
import messages from "@/messages.json";
import { Mail } from 'lucide-react'

const Home = () => {
  return (
    <>
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white">
      <section className='text-center mb-8 md:mb-12'>
        <h1 className='text-3xl md:text-5xl font-bold text-white'>
        Dive into world of Mystery Message!
        </h1>
        <p className='mt-3 md:mt-4 text-base text-white'>Mystery Message - Where your identity remains a secret.
        </p>

      </section>

      <Carousel plugins={[AutoPlay({delay: 2000})]} className="w-full max-w-lg md:max-w-xl">
      <CarouselContent>
        {
          messages.map((msg, index) => (
            <CarouselItem key={index} className='p-4'>
  
              <Card>
                <CardHeader className='text-black font-bold text-lg'>
                  {msg.title}
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                <Mail className="flex-shrink-0" />
                    <div>
                      <p>{msg.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {msg.received}
                      </p>
                    </div>
                </CardContent>
              </Card>
            
          </CarouselItem>
          ))
        }
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>

    </main>
    <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
      Made with ❤️ by Shashikant.
    </footer>
    </>
  )
}

export default Home