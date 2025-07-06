import { stockInsRouter } from '@/modules/stock-ins/server/procedures';

import { createTRPCRouter } from '../init';
import { groupsRouter } from '@/modules/groups/server/procedures';
export const appRouter = createTRPCRouter({
  stockIns: stockInsRouter,
  groups: groupsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;