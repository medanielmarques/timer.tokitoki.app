import { api } from "@/utils/api"
import { MantineProvider } from "@mantine/core"
import "@mantine/core/styles.css"
import { type AppType } from "next/app"
import { Montserrat } from "next/font/google"

const montserrat = Montserrat({ subsets: ["latin"] })

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <main className={montserrat.className}>
      <MantineProvider>
        <Component {...pageProps} />
      </MantineProvider>
    </main>
  )
}

export default api.withTRPC(MyApp)
