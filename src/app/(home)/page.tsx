import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary'
import { PageClient } from './client';

export default async function Home() {

  return(
    <PageClient />
  );
}
