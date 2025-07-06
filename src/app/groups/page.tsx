import { ClerkLoaded } from "@clerk/nextjs";

import { DEFAULT_LIMIT } from "@/constants";
import { HydrateClient, trpc } from "@/trpc/server";
import { GroupsView } from "@/modules/groups/ui/view/groups-view";

export default async function Groups() {
  void trpc.groups.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });

  return (
    <HydrateClient>
      <ClerkLoaded>
        <GroupsView />
      </ClerkLoaded>
    </HydrateClient>
  )
}