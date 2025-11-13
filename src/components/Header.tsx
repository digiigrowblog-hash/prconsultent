"use client"

import { useState } from "react";
import Link from "next/link";
import { BellRing , CircleUser , LogOut} from "lucide-react";
import { usePathname } from "next/navigation";

const user = true; // Replace with actual authentication logic


export default function Header() {
    const pathname = usePathname();

    return (

        <header className="w-full lg:px-16 md:px-8 px-3 py-4 flex 
        justify-between border-b border-gray-200 h-auto fixed top-0 left-0 right-0 bg-white z-50 ">

            <h1>
                <Link href="/" className=" md:text-2xl text-xl pt-serif-bold font-bold font- text-[#00a0a8]">
                    DocRefer
                </Link>
            </h1>
            <div>
                <nav className="space-x-4  flex justify-between items-center">
                    <Link
                        href="/"
                        className={`${pathname === "/" ? "text-[#00a0a8] font-semibold" : "text-gray-700 font-semibold"
                            } hover:text-[#00a0a8] hidden md:block`}
                    >
                        Home
                    </Link>
                    <Link
                        href="/doctorInfo"
                        className={`${pathname === "/doctorInfo" ? "text-[#00a0a8] font-semibold" : "text-gray-700 font-semibold"
                            } hover:text-[#00a0a8] hidden md:block`}
                    >
                        DoctorInfo
                    </Link>
                    <Link
                        href="/notification"
                        className={`${pathname === "/notification"
                                ?"text-[#00a0a8] font-semibold" : "text-gray-700 font-semibold"
                            } hover:text-[#00a0a8] hidden md:block`}
                    >
                        <BellRing className="w-5 h-5" />
                    </Link>
                    {}
                   

                    {user ? <CircleUser  className =""/> :<Link
                        href="/signup"
                        className={`${pathname === "/signup"
                                ? "text-blue-600 font-semibold"
                                : "text-gray-700"
                            } hover:text-[#00a0a8]  bg-gray-200 px-3 py-1.5 rounded-md text-center hidden md:block text-sm md:text-base`}
                    >
                        Signup
                    </Link>}

                  {user ? <Link
                        href="/signin"
                        className={`${pathname === "/signin"
                                ? "text-blue-600 font-semibold"
                                : "text-gray-700"
                            } hover:text-[#00a0a8] bg-gray-200 px-3 py-1.5 rounded-md text-center  text-sm md:text-base`}
                    >
                        <span className="mt-[-5px]"><LogOut/></span>
                    </Link> : <Link
                        href="/signin"
                        className={`${pathname === "/signin"
                                ? "text-blue-600 font-semibold"
                                : "text-gray-700"
                            } hover:text-[#00a0a8] bg-gray-200 px-3 py-1.5 rounded-md text-center  text-sm md:text-base`}
                    >
                        <span className="mt-[-5px]">Login </span>
                    </Link>}
                    {

                    }


                </nav>
            </div>
        </header>


    )
}
