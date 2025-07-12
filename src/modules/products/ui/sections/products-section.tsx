'use client';

import { toast } from "sonner";
import { ErrorBoundary } from "react-error-boundary"
import { Suspense, useState } from "react"
import { Loader2Icon, PlusIcon } from "lucide-react";

import { trpc } from "@/trpc/client"
import { DEFAULT_LIMIT } from "@/constants"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { GenericTable } from "@/components/generic-table";

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

  const [ newProductName, setNewProductName ] = useState("");
  const [ newProductGroupId, setNewProductGroupId ] = useState("");

  const [ editProductName, setEditProductName ] = useState("");
  const [ editProductGroupId, setEditProductGroupId ] = useState("");

  const utils = trpc.useUtils();
  const createProduct = trpc.products.create.useMutation({
    onSuccess: () => {
      setNewProductGroupId("");
      setNewProductName("");
      toast.success("Produto criado com sucesso!")
      utils.products.getMany.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  })

  const deleteProduct = trpc.products.delete.useMutation({
    onSuccess: () => {
      toast.success("Produto excluído com sucesso!");
      utils.products.getMany.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  })

  const updateProduct = trpc.products.update.useMutation({
    onSuccess: () => {
      setEditProductName("");
      setEditProductGroupId("");
      toast.success("Produto editado com sucesso!")
      utils.products.getMany.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  })

  return (
    <div>
      <div className="flex justify-center">
        <div className="flex">
          <Select onValueChange={(value) => setNewProductGroupId(value)}>
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
            onChange={(e) => setNewProductName(e.target.value)} 
          />
          <Button
            className="m-2"
            disabled={createProduct.isPending}
            onClick={() => {
              if ( !newProductGroupId || newProductName === "") {
                return;
              }
              createProduct.mutate({groupId: newProductGroupId, name: newProductName})
            }}
          >
          {createProduct.isPending ? <Loader2Icon className="animate-spin" /> : <PlusIcon />}
          Inserir novo Produto
          </Button>
          </div>
      </div>
      <div className="flex justify-center">
        <div>
          <GenericTable
            data={data.pages.flatMap((page) => page.items.map((item) => { 
              return {
                id: item.products.id, 
                name: item.products.name, 
                groupName: item.groups.name,
              }
            }))}
            getId = {(item) => item.id}
            // onEdit = {(item) => {
            //   if (!editProductName) {
            //     return;
            //   }
            //   updateProduct.mutate({ id: item.id, name: editProductName, groupId: editProductGroupId });
            // }}
            // getName = {(item) => item.name}
            headers = {["Nome", "Grupo"]}
            // onDelete = {(item) => {
            //   deleteProduct.mutate({ id: item.id })
            // }}
            getColumns = {(item) => [
              item.name,
              item.groupName
            ]}
            // editMutation = {updateProduct}
            // deleteMutation={deleteProduct}
            // dialogEditInputs={[
            //   { 
            //     label: "Nome",
            //     type: "text",
            //     placeholder: "Escreva aqui o nome do Produto",
            //     onChange: setEditProductName,
            //   },
            //   { 
            //     label: "Grupo",
            //     type: "text",
            //     placeholder: "Selecione o nome do Grupo",
            //     onChange: setEditProductGroupId,
            //   },
            // ]}
          />
          {/* <Table>
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
              {data.pages.flatMap(page => page.items).map((item, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{item.products.name}</TableCell>
                    <TableCell>{item.groups.name}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table> */}
        </div>
      </div>
    </div>
  )
}