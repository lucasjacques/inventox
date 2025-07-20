"use client"
import { GenericTable } from "@/components/generic-table";
import { DEFAULT_LIMIT } from "@/constants"
import { trpc } from "@/trpc/client"

export const InventorySection = () => {
  const [ data ] = trpc.inventory.getMany.useSuspenseInfiniteQuery({
    limit: DEFAULT_LIMIT,
  }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  return (
    <div className="flex justify-center">
      <div className="flex m-4">
        <GenericTable
          data={data.pages.flatMap( (page)=> page.items )}
          getColumns={(entry) => {
            return [
              entry.products.name,
              entry.quantity.toString(),
            ] 
          }}
          getId={(entry) => entry.products.id}
          headers={["Nome", "Quantidade"]}
        />
      </div>
    </div>
  )
}