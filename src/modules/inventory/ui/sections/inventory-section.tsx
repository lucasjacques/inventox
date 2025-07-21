"use client"
import { GenericTable } from "@/components/generic-table";
import { DEFAULT_LIMIT } from "@/constants"
import { trpc } from "@/trpc/client"
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const InventorySection = () => {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <ErrorBoundary fallback={<p>Erro...</p>}>
        <InventorySectionSuspense />
      </ErrorBoundary>
    </Suspense>
  )
}

const InventorySectionSuspense = () => {
  const [ rawData ] = trpc.inventory.getMany.useSuspenseInfiniteQuery({
    limit: DEFAULT_LIMIT,
  }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const data = rawData.pages
    .flatMap( (page)=> page.items )
    .sort((a, b) => {
      const groupNameA = a.groups.name.toUpperCase() 
      const groupNameB = b.groups.name.toUpperCase() 
      if (groupNameA < groupNameB) {
        return -1;
      }
      if (groupNameA > groupNameB) {
        return 1;
      }

      const productNameA = a.products.name.toUpperCase();
      const productNameB = b.products.name.toUpperCase();
      if (productNameA < productNameB) {
        return -1;
      }
      if (productNameA > productNameB) {
        return 1;
      }
      
      return 0;
    })

  return (
    <div className="flex justify-center">
      <div className="flex m-4">
        <GenericTable
          data={data}
          getColumns={(entry) => {
            return [
              entry.products.name,
              entry.quantity.toString(),
              entry.groups.name,
            ] 
          }}
          getId={(entry) => entry.products.id}
          headers={["Nome", "Quantidade", "Grupo"]}
        />
      </div>
    </div>
  )
}