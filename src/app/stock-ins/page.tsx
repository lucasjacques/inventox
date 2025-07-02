import { Suspense } from 'react';
import { ClerkLoaded } from '@clerk/nextjs';
import { ErrorBoundary } from 'react-error-boundary'

import { DEFAULT_LIMIT } from '@/constants';
import { HydrateClient, trpc } from "@/trpc/server";
import { StockInsView } from '@/modules/stock-ins/ui/view/stock-ins-view';

export default async function Home() {

  void trpc.stockIns.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

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