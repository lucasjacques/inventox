"use client"

import { toast } from "sonner"
import { ErrorBoundary } from "react-error-boundary"
import { Suspense, useState } from "react"
import { Loader2Icon, PlusIcon } from "lucide-react"

import { trpc } from "@/trpc/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DEFAULT_LIMIT } from "@/constants"
import { InfiniteScroll } from "@/components/infinite-scroll"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { ProductSelect } from "@/components/product-select"

import { CreateStockOutDialog } from "../dialogs/create-stock-out-dialog"

export const StockOutsSection = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <StockOutsSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  )
}

const StockOutsSectionSuspense = () => {
  const [ data, query ] = trpc.stockOuts.getMany.useSuspenseInfiniteQuery({
    limit: DEFAULT_LIMIT,
  }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const [productId, setProductId] = useState("");
  const [stockOutsQuantity, setStockOutsQuantity] = useState<number | undefined>();

  const utils = trpc.useUtils();
  const create = trpc.stockOuts.create.useMutation({
    onSuccess: () => {
      setProductId("");
      setStockOutsQuantity(undefined);
      toast.success("Saída criada com sucesso!");
      utils.stockOuts.getMany.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return (
    <div>
      <div className="flex justify-center">
        <div className="m-4">
          <CreateStockOutDialog
            products={data.pages[0].productsData}
            onCreate={() => {
              if( !productId || stockOutsQuantity === undefined ) {
                return;
              }
              create.mutate({productId: productId, quantity: stockOutsQuantity})
            }}
            createMutation={create}
            onChangeStockOutQuantity={setStockOutsQuantity}
            onChangeStockOutProductId={setProductId}
          />
        </div>
      </div>
      <div className="flex justify-center">
        <div>
          <Table>
            <TableCaption>Lista de saídas atualizada</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Data</TableHead>
                <TableHead >Produto</TableHead>
                <TableHead className="text-center w-[50px]">Quantidade</TableHead>
                <TableHead className="text-center w-[150px]">Autor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.pages.flatMap((page)=> page.items).map((row, index) => {
                    return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{row.stock_outs.createdAt.toLocaleString()}</TableCell>
                      <TableCell >{row.products.name}</TableCell>
                      <TableCell className="text-center">{row.stock_outs.quantity}</TableCell>
                      <TableCell className="text-center">{row.users.name}</TableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
          <InfiniteScroll
            hasNextPage={query.hasNextPage}
            isFetchingNextPage={query.isFetchingNextPage}
            fetchNextPage={query.fetchNextPage}
          />
        </div>
      </div>
    </div>
  )
}