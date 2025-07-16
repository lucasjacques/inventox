import { db } from "@/db";
import { groups, products, stockOuts, users } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, desc, eq, lt, or } from "drizzle-orm";
import { z } from "zod";

export const stockOutsRouter = createTRPCRouter({
  getMany: protectedProcedure
  .input(z.object({
    cursor: z.object({
      id: z.string().uuid(),
      updatedAt: z.date(),
    })
    .nullish(),
    limit: z.number().min(1).max(100),
  }))
  .query(async ({ input }) => {
    const { cursor, limit } = input;
    
    const data = await db
      .select()
      .from(stockOuts)
      .where(and(
        cursor
        ? or(
          lt(stockOuts.updatedAt, cursor.updatedAt),
          and(
            eq(stockOuts.updatedAt, cursor.updatedAt),
            lt(stockOuts.id, cursor.id),
          )
        )
        : undefined
      ))
      .orderBy(desc(stockOuts.updatedAt), desc(stockOuts.id))
      .limit(limit + 1)
      .innerJoin(products, eq(stockOuts.productId, products.id))
      .innerJoin(users, eq(stockOuts.userId, users.id))
    
    const hasMore = data.length > limit;
    const items = hasMore ? data.slice(0, -1) : data;
    const lastItem = items[items.length - 1];
    const nextCursor = hasMore
      ? {
        id: lastItem.stock_outs.id,
        updatedAt: lastItem.stock_outs.updatedAt,
      }
      : null;

    const productsData = await db
      .select()
      .from(products);

    return {
      items,
      productsData,
      nextCursor,
    }
  })
  
})