'use client';

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DEFAULT_LIMIT } from "@/constants"
import { trpc } from "@/trpc/client"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

export const ProductsSection = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <ProductsSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  )
}

const ProductsSectionSuspense = () => {
  const [ data ] = trpc.products.getMany.useSuspenseInfiniteQuery({
    limit: DEFAULT_LIMIT,
  }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  return (
    <div className="flex justify-center">
      <div >
        <Table>
          <TableCaption>
            Lista de produtos atualizada
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Grupo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.pages.flatMap(page => page.items).map((item) => {
              return (
                <TableRow>
                  <TableCell>{item.products.name}</TableCell>
                  <TableCell>{item.groups.name}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}