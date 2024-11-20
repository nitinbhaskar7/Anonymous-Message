"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '../ui/button'
import { signOut, useSession } from 'next-auth/react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
const Navbar = () => {
    const { data: session } = useSession();
    return (
        <div>
            <nav className='flex items-center p-2 bg-gray-800 text-white h-16 justify-between'>
                <Button asChild className="bg-white text-black border-2 hover:text-white hover:bg-black">
                    <Link href="/">
                        Anonymous Feedback
                    </Link>
                </Button>
                <ul className="flex gap-2 items-center">

                    {session ?
                        <>
                            <li>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" >Hello {session.user.username}</Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56">
                                        <DropdownMenuItem asChild>
                                            <Link href={"/dashboard"}>
                                                My Dashboard
                                            </Link>
                                        </DropdownMenuItem>

                                        <DropdownMenuSeparator />
                                       
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <Button onClick={() => {
                                                signOut()
                                            }} className="bg-white text-black border-2 hover:text-white hover:bg-black">
                                                Sign Out
                                            </Button>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </li>
                        </>
                        :
                        <>
                            <li>
                                Not Signed in
                            </li>
                            <li>
                                <Button asChild className="bg-white text-black border-2 hover:text-white hover:bg-black">
                                    <Link href="/sign-up">
                                        Sign-in
                                    </Link>
                                </Button>
                            </li> </>
                    }
                </ul>
            </nav>
        </div>
    )
}

export default Navbar
