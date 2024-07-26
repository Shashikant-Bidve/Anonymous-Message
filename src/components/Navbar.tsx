"use client"
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import {User} from "next-auth"
import { Button } from './ui/button'

const Navbar = () => {

  // data about session eg> active or not
  const {data: session} = useSession();

  const user: User = session?.user as User; 
  
  return (
    <nav className='p-4 md:p-6 shadow-md bg-navbarBlue'>
        <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
            <a className='text-xl font-bold mb-4 md:mb-0 text-white' href="#">Mystery Message</a>
            {
                session ? (
                    <>
                    <span className='mr-4'>Welcome, {user?.username || user?.email}</span>
                    <Button className='w-full md:w-auto' onClick={()=>signOut()}>Logout</Button>
                    </>
                ) : (
                <>
                    <Link href='/sign-in'>
                    <Button className='w-full md:w-auto bg-white text-black hover:bg-gray-400'>Login</Button>
                    </Link>
                </>)
            }
        </div>
    </nav>
  )
}

export default Navbar