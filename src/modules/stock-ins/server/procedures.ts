import { db } from "@/db";
import { stockIns } from "@/db/schema";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";

export const stockInsRouter = createTRPCRouter({
  getMany: protectedProcedure.query(async () => {
    const data = await db.select().from(stockIns);

    return data;
  }),
})