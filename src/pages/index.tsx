import { useSession } from "next-auth/react";
import HomePage from "~/componets/HomePage";
import LoginPage from "~/componets/LoginPage";

export default function Home() {

  const session = useSession()
  const user = session.data?.user
  
  return (
    <>
      { session.status === "authenticated" 
      ? <HomePage />
      : <LoginPage />
    }
    </>
  );
}

