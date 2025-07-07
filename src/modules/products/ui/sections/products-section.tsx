'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DEFAULT_LIMIT } from "@/constants"
import { trpc } from "@/trpc/client"
import { Loader2Icon, PlusIcon } from "lucide-react";
import { Suspense, useState } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { toast } from "sonner";

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

  const [ groupId, setGroupId ] = useState("");
  const [ productName, setProductName ] = useState("");

  const utils = trpc.useUtils();
  const create = trpc.products.create.useMutation({
    onSuccess: () => {
      setGroupId("");
      setProductName("");
      toast.success("Produto criado com sucesso!")
      utils.products.getMany.invalidate();
    }
  })

  return (
    <div>
      <div className="flex justify-center">
        <div className="flex">
          <Select onValueChange={(value) => setGroupId(value)}>
            <SelectTrigger className="m-2 w-[200px]" >
              <SelectValue placeholder="Selecione um grupo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {data.pages[0].groupsData.map((group, index) => {
                  return (
                    <SelectItem key={index} value={group.id}>{group.name}</SelectItem>
                  )
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input 
            className="m-2 w-[300px]"
            type="text"
            placeholder="Nome do produto"
            onChange={(e) => setProductName(e.target.value)} 
          />
          <Button
            className="m-2"
            disabled={create.isPending}
            onClick={() => {
              if ( !groupId || productName === "") {
                return;
              }
              create.mutate({groupId: groupId, name: productName})
            }}
          >
          {create.isPending ? <Loader2Icon className="animate-spin" /> : <PlusIcon />}
          Inserir novo Produto
          </Button>
          </div>
      </div>
      <div className="flex justify-center">
        <div>
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
    </div>
  )
}