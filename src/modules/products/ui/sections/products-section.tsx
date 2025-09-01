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
import { getPackageWeightInKg, getPriceInBRL, setPackageWeightStringForDB, setPriceStringForDB } from "@/lib/utils";

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
  const [ createProductPrice, setCreateProductPrice ] = useState("");
  const [ createProductGroupId, setCreateProductGroupId ] = useState("");
  const [ createProductPackageWeight, setCreateProductPackageWeight ] = useState("");

  const [ updateProductName, setUpdateProductName ] = useState("");
  const [ updateProductPrice, setUpdateProductPrice ] = useState("");
  const [ updateProductGroupId, setUpdateProductGroupId ] = useState("");
  const [ updateProductPackageWeight, setUpdateProductPackageWeight ] = useState("");

  const utils = trpc.useUtils();
  const createProduct = trpc.products.create.useMutation({
    onSuccess: () => {
      setCreateProductName("");
      setCreateProductPrice("");
      setCreateProductGroupId("");
      setCreateProductPackageWeight("");
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
      setUpdateProductPrice("");
      setUpdateProductGroupId("");
      setUpdateProductPackageWeight("");
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
            if ( !createProductGroupId || createProductName === "" ) {
              return;
            }
            createProduct.mutate({
              name: createProductName,
              price: setPriceStringForDB(createProductPrice),
              groupId: createProductGroupId,
              packageWeight: setPackageWeightStringForDB(createProductPackageWeight),
            });
          }}
          createMutation={createProduct}
          onChangeProductName={setCreateProductName}
          onChangeProductPrice={setCreateProductPrice}
          onChangeProductGroupId={setCreateProductGroupId}
          onChangeProductPackageWeight={setCreateProductPackageWeight}
        />
      </div>
      <div className="flex justify-center">
        <div className="flex m-4">
          <GenericTable
            data={data.pages.flatMap((page) => page.items)}
            getId = {(item) => item.products.id}
            headers = {["Nome","Preço","Grupo", "Peso (Kg)"]}
            getColumns = {(item) => [
              item.products.name,
              getPriceInBRL(item.products.price),
              item.groups.name,
              getPackageWeightInKg(item.products.packageWeight),
            ]}
            renderRowActions={(item) => (
              <div className="flex gap-3"> 
                <EditProductDialog
                  groups={groupsData}
                  onUpdate = {(item) => {
                    updateProduct.mutate({
                      id: item.id,
                      name: updateProductName,
                      price: setPriceStringForDB(updateProductPrice),
                      groupId: updateProductGroupId,
                      packageWeight: setPackageWeightStringForDB(updateProductPackageWeight),
                    });
                  }}
                  product={item.products}
                  onChangeName={setUpdateProductName}
                  onChangePrice={setUpdateProductPrice}
                  updateMutation={updateProduct}
                  onChangeGroupId={setUpdateProductGroupId}
                  onChangePackageWeight={setUpdateProductPackageWeight}
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