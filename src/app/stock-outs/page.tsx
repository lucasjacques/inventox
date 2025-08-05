import { ClerkLoaded } from "@clerk/nextjs";

import { DEFAULT_LIMIT } from "@/constants";
import { HydrateClient, trpc } from "@/trpc/server";
import { StockOutsView } from "@/modules/stock-outs/ui/views/stock-outs-view";

export default async function StockOuts() {

  void trpc.stockOuts.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <ClerkLoaded>
        <StockOutsView />
      </ClerkLoaded>
    </HydrateClient>
  )
}