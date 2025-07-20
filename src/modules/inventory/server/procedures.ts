import { z } from "zod";
import { and, desc, eq, lt, or } from "drizzle-orm";

import { db } from "@/db";
import { products, stockIns, stockOuts } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import { Inventory } from "../types";

export const inventoryRouter = createTRPCRouter({
  getMany: protectedProcedure
  .input(z.object({
    cursor: z.object({
      stockInsId: z.string(),
      stockInsUpdatedAt: z.date(),
      stockOutsId: z.string(),
      stockOutsUpdatedAt: z.date(),
    })
    .nullish(),
    limit: z.number().min(1).max(100),
  }))
  .query(async ({ ctx, input }) => {
    const { cursor, limit } = input;

    const dataStockIns = await db
      .select()
      .from(stockIns)
      .where(and(
        cursor
        ? or(
            lt(stockIns.updatedAt, cursor.stockInsUpdatedAt),
            and(
              eq(stockIns.updatedAt, cursor.stockInsUpdatedAt),
              lt(stockIns.id, cursor.stockInsId)
            )
          )
        : undefined
      ))
      .orderBy(desc(stockIns.updatedAt), desc(stockIns.id))
      .limit(limit + 1)
      .innerJoin(products, eq(stockIns.productId, products.id));
  
    const hasMoreStockIns = dataStockIns.length > limit;
    const itemsStockIns = hasMoreStockIns ? dataStockIns.slice(0, -1) : dataStockIns;
    const lastItemStockIns = itemsStockIns[itemsStockIns.length - 1];

    const dataStockOuts = await db
      .select()
      .from(stockOuts)
      .where(and(
        cursor
        ? or(
            lt(stockOuts.updatedAt, cursor.stockOutsUpdatedAt),
            and(
              eq(stockOuts.updatedAt, cursor.stockOutsUpdatedAt),
              lt(stockOuts.id, cursor.stockOutsId)
            )
          )
        : undefined
      ))
      .orderBy(desc(stockOuts.updatedAt), desc(stockOuts.id))
      .limit(limit + 1)
      .innerJoin(products, eq(stockOuts.productId, products.id));
  
    const hasMoreStockOuts = dataStockOuts.length > limit;
    const itemsStockOuts = hasMoreStockOuts ? dataStockOuts.slice(0, -1) : dataStockOuts;
    const lastItemStockOuts = itemsStockOuts[itemsStockOuts.length - 1];

    const hasMore = hasMoreStockIns || hasMoreStockOuts;

    const nextCursor = hasMore
      ? {
        stockInsId: lastItemStockIns.stock_ins.id,
        stockInsUpdatedAt: lastItemStockIns.stock_ins.updatedAt,
        stockOutsId: lastItemStockOuts.stock_outs.id,
        stockOutsUpdatedAt: lastItemStockOuts.stock_outs.updatedAt,
      }
      : null;

    const inventoryMap = new Map<string, Inventory>
    for (const { products, stock_ins } of itemsStockIns) {
      const existing = inventoryMap.get(products.id);
      if (existing) {
        existing.quantity += stock_ins.value;
      } else {
        inventoryMap.set(products.id, {
          products,
          quantity: stock_ins.value,
        })
      }
    }

    for (const { products, stock_outs } of itemsStockOuts) {
      const existing = inventoryMap.get(products.id);
      if (existing) {
        existing.quantity -= stock_outs.value;
      } else {
        inventoryMap.set(products.id, {
          products,
          quantity: -stock_outs.value,
        })
      }
    }

    const items: Inventory[] = Array.from(inventoryMap.values())

    return {
      items,
      nextCursor,
    }
  })
})