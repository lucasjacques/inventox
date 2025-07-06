import { z } from "zod";

import { db } from "@/db";
import { groups } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, desc, eq, lt, or } from "drizzle-orm";

export const groupsRouter = createTRPCRouter({
  getMany: protectedProcedure
  .input(z.object({
    cursor: z.object({
      id: z.string().uuid(),
      name: z.string(),
    })
    .nullish(),
    limit: z.number().min(1).max(100),
  }))
  .query(async ({ ctx, input }) => {
    const { cursor, limit } = input;

    const data = await db
      .select()
      .from(groups)
      .where(and(
        cursor
        ? or (
          lt(groups.name, cursor.name),
          and(
            eq(groups.name, cursor.name),
            lt(groups.id, cursor.id),
          )
        )
        : undefined
      ))
      .orderBy(desc(groups.name), desc(groups.id))
      .limit(limit + 1);

    const hasMore = data.length > limit;
    // Remove the last item if there is more that
    const items = hasMore ? data.slice(0, -1) : data;
    // Set the next cursor to the last item if there is more data;
    const lastItem = items[items.length - 1];
    const nextCursor = hasMore
      ? {
        id: lastItem.id,
        name: lastItem.name
      }
      : null;
    
    return {
      items,
      nextCursor,
    }
  })
})