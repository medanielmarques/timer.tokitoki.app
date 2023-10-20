import { type AppType } from "next/app";
import { MantineProvider } from "@mantine/core";

import { api } from "@/utils/api";

import "@mantine/core/styles.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <MantineProvider>
      <Component {...pageProps} />
    </MantineProvider>
  );
};

export default api.withTRPC(MyApp);
