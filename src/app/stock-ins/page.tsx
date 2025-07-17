import { ClerkLoaded } from '@clerk/nextjs';

import { DEFAULT_LIMIT } from '@/constants';
import { HydrateClient, trpc } from "@/trpc/server";
import { StockInsView } from '@/modules/stock-ins/ui/view/stock-ins-view';

export default async function StockIns() {

  void trpc.stockIns.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <ClerkLoaded>
        <StockInsView />
      </ClerkLoaded>
    </HydrateClient>
  );
}