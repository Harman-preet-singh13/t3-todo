import { signIn, useSession } from "next-auth/react"
import { BsDiscord } from "react-icons/bs"
import { BiLogIn } from "react-icons/bi"

export default function LoginPage() {

    const session = useSession()
    const user = session.data?.user

    return (
        <div className=" flex h-screen items-center justify-center ">
            <button
                className="flex bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                onClick={() => void signIn()}>
                Log In
                <span className="m-1 pl-2 text-xl">
                    <BsDiscord />
                </span>
            </button>
        </div>
    )
}
