import { ClerkLoaded } from "@clerk/nextjs";

import { DEFAULT_LIMIT } from "@/constants";
import { HydrateClient, trpc } from "@/trpc/server";
import { ProductsView } from "@/modules/products/ui/view/products-view";

export default function Page() {
  void trpc.products.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <ClerkLoaded>
        <ProductsView />
      </ClerkLoaded>
    </HydrateClient>
  )
}