import { env } from "@/env.mjs"
import { appRouter } from "@/server/api/root"
import { createTRPCContext } from "@/server/api/trpc"
import { H, Handlers } from "@highlight-run/node"
import { type TRPCError } from "@trpc/server"
import { createNextApiHandler } from "@trpc/server/adapters/next"
import { type NextApiRequest } from "next"

const isProduction = process.env.NODE_ENV === "production"

isProduction &&
  H.init({
    tracingOrigins: ["http://localhost:3000", "https://tokitoki.app"],
    networkRecording: {
      enabled: true,
      recordHeadersAndBody: true,
    },
    projectID: process.env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID!,
    serviceName: process.env.NEXT_PUBLIC_HIGHLIGHT_SERVICE_NAME!,
    environment: process.env.NODE_ENV,
  })

function devLogging(error: TRPCError, path: string | undefined) {
  console.error(`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`)
}

async function productionLogging(error: TRPCError, req: NextApiRequest) {
  await Handlers.trpcOnError(
    { error, req },
    {
      projectID: process.env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID!,
      serviceName: process.env.NEXT_PUBLIC_HIGHLIGHT_SERVICE_NAME!,
      serviceVersion: "git-sha",
      environment: process.env.NODE_ENV,
    },
  )
}

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError: ({ path, error, req }) => {
    switch (env.NODE_ENV) {
      case "production":
        productionLogging(error, req)
          .then(() => {})
          .catch(() => {})

      default:
        devLogging(error, path)
        break
    }
  },
})
