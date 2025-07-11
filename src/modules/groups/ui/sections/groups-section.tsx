"use client";

import { toast } from "sonner";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Loader2Icon, PencilIcon, PlusIcon, XIcon } from "lucide-react";

import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { ActionsTable } from "@/components/actions-table";

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

  const [ newGroupName, setNewGroupName ] = useState("");
  const [ editGroupName, setEditGroupName ] = useState("");

  const utils = trpc.useUtils();
  const createGroup = trpc.groups.create.useMutation({
    onSuccess: () => {
      setNewGroupName("");
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
      toast.success("Grupo editado com sucesso!");
      utils.groups.getMany.invalidate();
    }
  })

  const mockData = [ 
    {
      name: "Grupo 1",
      products: "Produto 11",
      quantity: 6,
    }, 
    {
      name: "Grupo 2",
      products: "Produto 12",
      quantity: 7,
    }, 
    {
      name: "Grupo 3",
      products: "Produto 13",
      quantity: 8,
    }, 
    {
      name: "Grupo 4",
      products: "Produto 14",
      quantity: 9,
    }, 
    {
      name: "Grupo 5",
      products: "Produto 15",
      quantity: 10,
    }, 
  ]

  return (
    <div>
      <div className="flex justify-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="blue">Adicionar Novo Grupo</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[350px]">
            <DialogHeader>
              <DialogTitle>Criação de Grupo</DialogTitle>
            </DialogHeader>
            <form
              className="flex flex-col gap-3"
              onSubmit={(e) => {
                  e.preventDefault();
                  if (newGroupName === "") {
                    return;
                  }
                  createGroup.mutate({groupName: newGroupName});
                }}>
              <div className="flex flex-col gap-3">
                <Label>Nome:</Label>
                <Input
                  type="text"
                  placeholder="Escreva um nome para o grupo"
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button
                  variant="blue"
                  disabled={createGroup.isPending}
                  >
                    {createGroup.isPending ? <Loader2Icon className="animate-spin" /> : <PlusIcon />}
                  Adicionar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex justify-center">
        <div className="m-4 flex">
          <ActionsTable
            data={data.pages.flatMap((page) => page.items)}
            onEdit={(item) => {
              if (!editGroupName) {
                return;
              }
              updateGroup.mutate({ id: item.id, name: editGroupName });
            }}
            getName={(item) => item.name}
            headers={["Nome"]}
            onDelete={(item) => { deleteGroup.mutate({ id: item.id })}}
            getColumns={(item) => [item.name]}
            editMutation={updateGroup}
            editOnChange={setEditGroupName}
            deleteMutation={deleteGroup}
          />
        </div>
      </div>
      <div className="pl-6">
      </div>
    </div>
  )
}