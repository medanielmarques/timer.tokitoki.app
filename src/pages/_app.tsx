import { LocalStorageSettingsProvider } from "@/lib/use-local-storage-settings"
import { api } from "@/utils/api"
import { supabase } from "@/utils/supabase"
import { HighlightInit } from "@highlight-run/next/client"
import { SessionContextProvider } from "@supabase/auth-helpers-react"
import { type AppType } from "next/app"
import { Montserrat } from "next/font/google"
import posthog from "posthog-js"
import { PostHogProvider } from "posthog-js/react"

import "../globals.css"

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com",
    // Enable debug mode in development
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") posthog.debug()
    },
  })
}

const montserrat = Montserrat({ subsets: ["latin"] })

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <PostHogProvider>
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
    </PostHogProvider>
  )
}

export default api.withTRPC(MyApp)
