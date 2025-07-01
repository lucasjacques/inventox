import { db } from "@/db";
import { products, stockIns, users } from "@/db/schema";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { eq } from "drizzle-orm";

export const stockInsRouter = createTRPCRouter({
  getMany: protectedProcedure.query(async () => {
    const stockInsData = await db
      .select()
      .from(stockIns)
      .innerJoin(products, eq(stockIns.productId, products.id))
      .innerJoin(users, eq(stockIns.userId, users.id));

    return stockInsData;
  }),
})