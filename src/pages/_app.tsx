import { api } from "@/utils/api"
import { supabase } from "@/utils/supabase"
import { SessionContextProvider } from "@supabase/auth-helpers-react"
import { type AppType } from "next/app"
import { Montserrat } from "next/font/google"

import "../globals.css"

const montserrat = Montserrat({ subsets: ["latin"] })

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <main className={montserrat.className}>
      <SessionContextProvider supabaseClient={supabase}>
        <Component {...pageProps} />
      </SessionContextProvider>
    </main>
  )
}

export default api.withTRPC(MyApp)
