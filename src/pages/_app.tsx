import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Head from "next/head";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>T3-Todo</title>
      </Head>
      <div className="bg-slate-200">
        <div className=" container mx-auto sm:pr-4">
          <div className="min-h-screen ">
            <Component {...pageProps} />
          </div>
        </div>
      </div>


    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);