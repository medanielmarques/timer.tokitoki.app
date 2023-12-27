import { LocalStorageSettingsProvider } from "@/lib/use-local-storage-settings"
import { api } from "@/utils/api"
import { supabase } from "@/utils/supabase"
import { HighlightInit } from "@highlight-run/next/client"
import { SessionContextProvider } from "@supabase/auth-helpers-react"
import { type AppType } from "next/app"
import { Montserrat } from "next/font/google"

import "../globals.css"

const montserrat = Montserrat({ subsets: ["latin"] })

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      {process.env.NODE_ENV === "development" && (
        <HighlightInit
          projectId={process.env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID}
          serviceName={process.env.NEXT_PUBLIC_HIGHLIGHT_SERVICE_NAME}
          tracingOrigins
          networkRecording={{
            enabled: true,
            recordHeadersAndBody: true,
            urlBlocklist: [],
          }}
        />
      )}

      <main className={montserrat.className}>
        <SessionContextProvider supabaseClient={supabase}>
          <LocalStorageSettingsProvider>
            <Component {...pageProps} />
          </LocalStorageSettingsProvider>
        </SessionContextProvider>
      </main>
    </>
  )
}

export default api.withTRPC(MyApp)
