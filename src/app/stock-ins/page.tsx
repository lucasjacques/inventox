import { Suspense } from 'react';
import { ClerkLoaded } from '@clerk/nextjs';
import { ErrorBoundary } from 'react-error-boundary'

import { HydrateClient, trpc } from "@/trpc/server";
import { StockInsView } from '@/modules/stock-ins/ui/view/stock-ins-view';

export default async function Home() {

  void trpc.stockIns.getMany.prefetch();

  return(
    <HydrateClient>
      <Suspense fallback={<p>Loading...</p>}>
        <ErrorBoundary fallback={<p>Error...</p>}>
          <ClerkLoaded>
            <StockInsView />
          </ClerkLoaded>
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  );
}