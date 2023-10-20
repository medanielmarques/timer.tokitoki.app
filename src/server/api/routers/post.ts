import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  // protectedProcedure,
} from "@/server/api/trpc";
import { db, genId } from "@/server/db";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
      // await db.insertInto("User").values({ id: genId() }).executeTakeFirstOrThrow();
      const idk = await db
        .selectFrom("User")
        .selectAll()
        // .where("User.id", "=", "1")
        .execute();

      console.log(idk, "idk");

      return {
        greeting: `Hello ${input.text}`,
        // idk,
      };
    }),

  // getSecretMessage: protectedProcedure.query(() => {
  //   return "you can now see this secret message!";
  // }),
});
