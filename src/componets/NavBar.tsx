import { signOut, useSession } from "next-auth/react";
import { BiLogOut } from "react-icons/bi"
import { GiHamburgerMenu } from "react-icons/gi"
import { AiOutlineClose } from "react-icons/ai"
import IconHoverEffect from "./IconHoverEffect";
import { useState } from "react";
import Link from "next/link";


export default function NavBar() {


    const session = useSession()
   

    const [navbar, setNavbar] = useState(false)

    return (

        <nav className="w-full bg-gray-800 shadow">
            <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
                <div>
                    <div className="flex items-center justify-between py-3 md:py-5 md:block">
                        <div className="flex items-center">
                            <img src="https://create.t3.gg/images/t3-light.svg" className="h-8 mr-3" alt="T3 Logo" />
                            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                                Todo App
                            </span>
                        </div>
                        <div className="md:hidden">
                            <button
                                className="text-white text-3xl p-2 rounded-md outline-none focus:border-gray-400 focus:border"
                                onClick={() => setNavbar(!navbar)}
                            >
                                {navbar ? (
                                    <AiOutlineClose className=" fill-white" />
                                ) : (
                                    <GiHamburgerMenu />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <div
                        className={` justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${navbar ? 'block' : 'hidden'
                            }`}
                    >
                        <ul className=" items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0">
                            <li className="text-white">
                                <h1 className="text-white sm:text-base md:text-md lg:text-lg">
                                    Welcome
                                    <span className="text-blue-300"> {session.data?.user.name}</span>!
                                </h1>
                            </li>
                            <li className="text-white">
                                <h1 className="text-white sm:text-base md:text-md lg:text-lg">
                                    <button
                                        className="flex bg-gray-800 hover:bg-blue-700 text-white py-1 px-4 border border-blue-700 rounded"
                                        onClick={() => void signOut()}>
                                        Log Out
                                        <span className="m-1 pl-2 text-xl">
                                            <BiLogOut />
                                        </span>
                                    </button>
                                </h1>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    )
}
