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
import { GenericTable } from "@/components/generic-table";
import { GroupSelect } from "../group-select";
import { EditProductDialog } from "../dialogs/edit-product-dialog";
import { DeleteProductDialog } from "../dialogs/delete-product-dialog";

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

  const groupsData = data.pages[0].groupsData;

  return (
    <div>
      <div className="flex justify-center">
        <div className="flex">
          <GroupSelect
            groups={groupsData}
            onChange={setNewProductGroupId}
          />
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
                group: {
                  id: item.groups.id,
                  name: item.groups.name,
                } 
              }
            }))}
            getId = {(item) => item.id}
            headers = {["Nome", "Grupo"]}
            getColumns = {(item) => [
              item.name,
              item.group.name
            ]}
            renderRowActions={(product) => (
              <div className="flex gap-3"> 
                <EditProductDialog
                  groups={groupsData}
                  onEdit = {(item) => {
                    if (!editProductName) {
                      return;
                    }
                    updateProduct.mutate({ id: item.id, name: editProductName, groupId: editProductGroupId });
                  }}
                  product={product}
                  onChangeName={setEditProductName}
                  editMutation={updateProduct}
                  onChangeGroupId={setEditProductGroupId}
                />
                <DeleteProductDialog
                  product={product}
                  onDelete={(item) => {
                    deleteProduct.mutate({id: product.id})
                  }}
                  deleteMutation={deleteProduct}
                />
              </div>
            )}
          />
        </div>
      </div>
    </div>
  )
}