import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary'
import { PageClient } from './client';
import { HydrateClient, trpc } from "@/trpc/server";
import { ClerkLoaded } from '@clerk/nextjs';
import { InventoryView } from '@/modules/inventory/ui/views/inventory-view';
import { DEFAULT_LIMIT } from '@/constants';

export default async function Home() {
  void trpc.inventory.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return(
    <HydrateClient>
      <Suspense fallback={<p>Loading...</p>}>
        <ErrorBoundary fallback={<p>Error...</p>}>
          <ClerkLoaded>
            {/* <PageClient /> */}
            <InventoryView />
          </ClerkLoaded>
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  );
}
