import { stockInsRouter } from '@/modules/stock-ins/server/procedures';
import { groupsRouter } from '@/modules/groups/server/procedures';

import { createTRPCRouter } from '../init';
export const appRouter = createTRPCRouter({
  groups: groupsRouter,
  stockIns: stockInsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;