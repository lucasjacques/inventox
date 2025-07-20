"use client"
import { DEFAULT_LIMIT } from "@/constants"
import { trpc } from "@/trpc/client"

export const InventorySection = () => {
  const [ data ] = trpc.inventory.getMany.useSuspenseInfiniteQuery({
    limit: DEFAULT_LIMIT,
  }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  return (
    <p>{JSON.stringify(data)}</p>
  )
}