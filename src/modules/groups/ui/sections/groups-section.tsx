"use client";

import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2Icon, PlusIcon } from "lucide-react";

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

  const [ groupName, setGroupName ] = useState("");

  const utils = trpc.useUtils();
  const create = trpc.groups.create.useMutation({
    onSuccess: () => {
      setGroupName("");
      toast.success("Grupo criado com sucesso!");
      utils.groups.getMany.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  })
  return (
    <div>
      <div className="flex justify-center">
        <div className="m-4 flex w-[500px]">
          <Input 
            className="m-2"
            type="text"
            placeholder="Escreva um nome para o grupo"
            onChange={(e) => setGroupName(e.target.value)}
          />
          <Button 
            className="m-2"
            disabled={create.isPending}
            onClick={ () => {
              if (groupName === "") {
                return;
              }
              create.mutate({groupName: groupName});
            }}
          >
          {create.isPending ? <Loader2Icon className="animate-spin" /> : <PlusIcon />}
          Inserir novo grupo
          </Button>
        </div>

      </div>
      <div className="flex justify-center">
        <div className="m-4 flex w-[400px]">
          <Table>
            <TableCaption>
              Lista de grupos atualizada
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.pages.flatMap((page) => page.items).map((items, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{items.name}</TableCell>
                    <TableCell><Button variant={"destructive"}>Deletar</Button></TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="pl-6">
      </div>
    </div>
  )
}