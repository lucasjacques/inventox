import { z } from "zod"
import { eq, and, or, lt, desc } from "drizzle-orm";

import { db } from "@/db";
import { products, stockIns, users } from "@/db/schema";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";

export const stockInsRouter = createTRPCRouter({
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
      .from(stockIns)
      .where(and(
        cursor 
        ? or(
            lt(stockIns.updatedAt, cursor.updatedAt),
            and(
              eq(stockIns.updatedAt, cursor.updatedAt),
              lt(stockIns.id, cursor.id)
            )
          )
        : undefined,
      ))
      .orderBy(desc(stockIns.updatedAt), desc(stockIns.id))
      // Add 1 to the limit to check if there is more data
      .limit(limit + 1)
      .innerJoin(products, eq(stockIns.productId, products.id))
      .innerJoin(users, eq(stockIns.userId, users.id));

    const hasMore = data.length > limit;
    // Remove the last item if there is more data
    const items = hasMore ? data.slice(0, -1) : data;
    // Set the next cursor to the last item if there is more data
    const lastItem = items[items.length - 1];
    const nextCursor = hasMore 
      ? {
        id: lastItem.stock_ins.id,
        updatedAt: lastItem.stock_ins.updatedAt,
      }
      : null;
      
    const productsData = await db
      .select()
      .from(products);

    return {
      items,
      productsData,
      nextCursor,
    };
  }),
  
  create: protectedProcedure
    .input(z.object({
      productId: z.string(),
      quantity: z.number().nonnegative(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      const [ stockIn ] = await db
        .insert(stockIns)
        .values({
          userId,
          productId: input.productId,
          quantity: input.quantity,
        })
        .returning();
      
      return {
        stockIn: stockIn,
      };
    }),
})