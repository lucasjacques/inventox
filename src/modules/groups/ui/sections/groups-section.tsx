"use client";

import { toast } from "sonner";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Loader2Icon, PencilIcon, PlusIcon, XIcon } from "lucide-react";

import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";
import { GenericTable } from "@/components/generic-table";
import { EditGroupDialog } from "../dialogs/edit-group-dialog";
import { DeleteGroupDialog } from "../dialogs/delete-group-dialog";
import { CreateGroupDialog } from "../dialogs/create-group-dialog";

export const GroupsSection = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <GroupsSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  )
}

const GroupsSectionSuspense = () => {
  const [ data, query ] = trpc.groups.getMany.useSuspenseInfiniteQuery({
    limit: DEFAULT_LIMIT,
  }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const [ createGroupName, setCreateGroupName ] = useState("");
  const [ editGroupName, setEditGroupName ] = useState("");

  const utils = trpc.useUtils();
  const createGroup = trpc.groups.create.useMutation({
    onSuccess: () => {
      setCreateGroupName("");
      toast.success("Grupo criado com sucesso!");
      utils.groups.getMany.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  })
  const deleteGroup = trpc.groups.delete.useMutation({
    onSuccess: () => {
      toast.success("Grupo removido com sucesso!");
      utils.groups.getMany.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  })
  const updateGroup = trpc.groups.update.useMutation({
    onSuccess: () => {
      setEditGroupName("");
      toast.success("Grupo editado com sucesso!");
      utils.groups.getMany.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  })

  return (
    <div>
      <div className="flex justify-center">
        <CreateGroupDialog 
          onCreate={() => {
            if (createGroupName === "") {
              return;
            }
            createGroup.mutate({groupName: createGroupName});
          }}
          createMutation={createGroup}
          onChangeGroupName={setCreateGroupName}

        />
      </div>
      <div className="flex justify-center">
        <div className="flex m-4">
          <GenericTable
            data={data.pages.flatMap((page) => page.items)}
            getId={(item) => item.id}
            headers={["Nome"]}
            getColumns={(item) => [item.name]}
            renderRowActions={(group) => (
              <div className="flex gap-3"> 
                <EditGroupDialog 
                  group={group}
                  onEdit={(item) => {
                    if (!editGroupName) {
                      return;
                    }
                    updateGroup.mutate({ id: item.id, name: editGroupName });
                  }}
                  onChange={setEditGroupName}
                  editMutation={updateGroup}
                />
                <DeleteGroupDialog
                  group={group}
                  onDelete={(item) => { deleteGroup.mutate({ id: item.id })}}
                  deleteMutation={deleteGroup}
                />
              </div>
            )}
          />
        </div>
      </div>
      <div className="pl-6">
      </div>
    </div>
  )
}