import { db } from "@/db";
import { stockIns } from "@/db/schema";
import { protectedProcedure, createTRPCRouter, baseProcedure } from "@/trpc/init";

export const stockInsRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const data = await db.select().from(stockIns);

    return data;
  }),
})