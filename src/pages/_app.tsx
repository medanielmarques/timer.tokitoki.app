import { api } from "@/utils/api"
import { MantineProvider } from "@mantine/core"
import "@mantine/core/styles.css"
import { type AppType } from "next/app"

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <MantineProvider>
      <Component {...pageProps} />
    </MantineProvider>
  )
}

export default api.withTRPC(MyApp)
