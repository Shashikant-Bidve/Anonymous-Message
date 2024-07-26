'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue, useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import axios,{AxiosError} from "axios";
import { ApiResponse } from "@/types/ApiResponse"
import { signUpSchema } from "@/schemas/signUpSchema"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"
import { describe } from "node:test"

const page = () => {

  const { toast } = useToast();
  const router = useRouter();

  // zod implementation 
  // this will act as field in Form
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password:''
    }
  })


  const onSubmit = async (data : z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials',{
      redirect: false,
      identifier: data.identifier,
      password: data.password
    })

    if(result?.error){
      toast({
        title: "Login failed",
        description: "Incorrect credentials.",
        variant: "destructive"
      })
    }

    if(result?.url){
      router.replace('/dashboard'); 
    }
    }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Anonymous Message
          </h1>
          <p className="mb-4">Sign In to start anonymous adventure!</p>
        </div>

        {/* form is field here*/}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email/Username</FormLabel>
              <FormControl>
                {/* no need of onChange here as when we submit the value is set to field */}
                <Input placeholder="email or username" {...field}  />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

          <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          SignIn
        </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Start your journey{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page;
