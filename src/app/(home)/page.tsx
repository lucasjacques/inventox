import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary'
import { PageClient } from './client';
import { HydrateClient, trpc } from "@/trpc/server";
import { ClerkLoaded } from '@clerk/nextjs';

export default async function Home() {

  void trpc.hello.prefetch({ text: "Lucas3" })

  return(
    <HydrateClient>
      <Suspense fallback={<p>Loading...</p>}>
        <ErrorBoundary fallback={<p>Error...</p>}>
          <ClerkLoaded>
            <PageClient />
          </ClerkLoaded>
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  );
}
