import { groupsRouter } from '@/modules/groups/server/procedures';
import { productsRouter } from '@/modules/products/server/procedures';
import { stockInsRouter } from '@/modules/stock-ins/server/procedures';
import { inventoryRouter } from '@/modules/inventory/server/procedures';
import { stockOutsRouter } from '@/modules/stock-outs/server/procedures';

import { createTRPCRouter } from '../init';
export const appRouter = createTRPCRouter({
  groups: groupsRouter,
  products: productsRouter,
  stockIns: stockInsRouter,
  inventory: inventoryRouter,
  stockOuts: stockOutsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;