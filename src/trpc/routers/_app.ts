import { stockInsRouter } from '@/modules/stock-ins/server/procedures';

import { createTRPCRouter } from '../init';
export const appRouter = createTRPCRouter({
  stockIns: stockInsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;