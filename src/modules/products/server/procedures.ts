import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import { groups, products } from "@/db/schema";
import { and, desc, eq, lt, or } from "drizzle-orm";

export const productsRouter = createTRPCRouter({
  create: protectedProcedure
  .input(z.object({
    name: z.string(),
    price: z.number().nullish(),
    groupId: z.string().uuid(),
  }))
  .mutation(async ({ input }) => {
    const [ product ] = await db
      .insert(products)
      .values({
        name: input.name,
        price: input.price,
        groupId: input.groupId,
      })
      .returning();
    
    return {
      product: product,
    };
  }),
  delete: protectedProcedure
  .input(z.object({
    id: z.string().uuid(),
  }))
  .mutation(async ({ input }) => {
    const [ product ] = await db
    .delete(products)
    .where(eq(products.id, input.id))
    .returning();

    return { product };
  }),
  update: protectedProcedure
  .input(z.object({
    id: z.string().uuid(),
    name: z.string(),
    price: z.number().nullish(),
    groupId: z.string().uuid(),
  }))
  .mutation(async ({ input }) => {
    const [ product ] = await db
      .update(products)
      .set({
        name: input.name,
        price: input.price,
        groupId: input.groupId,
      })
      .where(eq(products.id, input.id))
      .returning()

    return { product };
  }),
  getMany: protectedProcedure
  .input(z.object({
    cursor: z.object({
      id: z.string().uuid(),
      name: z.string(),
    })
    .nullish(),
    limit: z.number().min(1).max(100),
  }))
  .query(async ({ input }) => {
    const { cursor, limit } = input;

    const data = await db
      .select()
      .from(products)
      .where(and(
        cursor
        ? or(
          lt(products.name, cursor.name),
          and(
            eq(products.name, cursor.name),
            lt(products.id, cursor.id),
          )
        )
        : undefined
      ))
      .orderBy(desc(products.name), desc(products.id))
      .limit(limit + 1)
      .innerJoin(groups, eq(products.groupId, groups.id));

    const hasMore = data.length > limit;
    // Remove the last item if there is more that
    const items = hasMore ? data.slice(0, -1) : data;
    // Set the next cursor to the last item if there is more data;
    const lastItem = items[items.length - 1];
    const nextCursor = hasMore
      ? {
        id: lastItem.products.id,
        name: lastItem.products.name,
      }
      : null

    const groupsData = await db
      .select()
      .from(groups)
      .orderBy(groups.name)

    return {
      items,
      groupsData,
      nextCursor,
    };
  }),
})