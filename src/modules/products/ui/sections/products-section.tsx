'use client';

import { toast } from "sonner";
import { ErrorBoundary } from "react-error-boundary"
import { Suspense, useState } from "react"

import { trpc } from "@/trpc/client"
import { DEFAULT_LIMIT } from "@/constants"
import { GenericTable } from "@/components/generic-table";
import { EditProductDialog } from "../components/dialogs/update-product-dialog";
import { DeleteProductDialog } from "../components/dialogs/delete-product-dialog";
import { CreateProductDialog } from "../components/dialogs/insert-product-dialog";

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

  const [ createProductName, setCreateProductName ] = useState("");
  const [ createProductGroupId, setCreateProductGroupId ] = useState("");

  const [ updateProductName, setUpdateProductName ] = useState("");
  const [ updateProductGroupId, setUpdateProductGroupId ] = useState("");

  const utils = trpc.useUtils();
  const createProduct = trpc.products.create.useMutation({
    onSuccess: () => {
      setCreateProductGroupId("");
      setCreateProductName("");
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
      setUpdateProductName("");
      setUpdateProductGroupId("");
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
        <CreateProductDialog
          groups={groupsData}
          onCreate={() => {
            if ( !createProductGroupId || createProductName === "") {
              return;
            }
            createProduct.mutate({groupId: createProductGroupId, name: createProductName})
          }}
          createMutation={createProduct}
          onChangeProductName={setCreateProductName}
          onChangeProductGroupId={setCreateProductGroupId}
        />
      </div>
      <div className="flex justify-center">
        <div className="flex m-4">
          <GenericTable
            data={data.pages.flatMap((page) => page.items)}
            getId = {(item) => item.products.id}
            headers = {["Nome", "Grupo"]}
            getColumns = {(item) => [
              item.products.name,
              item.groups.name
            ]}
            renderRowActions={(item) => (
              <div className="flex gap-3"> 
                <EditProductDialog
                  groups={groupsData}
                  onUpdate = {(item) => {
                    if (!updateProductName) {
                      return;
                    }
                    updateProduct.mutate({ id: item.id, name: updateProductName, groupId: updateProductGroupId });
                  }}
                  product={item.products}
                  onChangeName={setUpdateProductName}
                  updateMutation={updateProduct}
                  onChangeGroupId={setUpdateProductGroupId}
                />
                <DeleteProductDialog
                  product={item.products}
                  onDelete={(item) => {
                    deleteProduct.mutate({id: item.id})
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