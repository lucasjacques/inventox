import { ClerkLoaded } from '@clerk/nextjs';

import { DEFAULT_LIMIT } from '@/constants';
import { HydrateClient, trpc } from "@/trpc/server";
import { InventoryView } from '@/modules/inventory/ui/views/inventory-view';

export default async function Home() {
  void trpc.inventory.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return(
    <HydrateClient>
      <ClerkLoaded>
        <InventoryView />
      </ClerkLoaded>
    </HydrateClient>
  );
}
