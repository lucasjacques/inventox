"use client";

import { Loader2Icon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { InfiniteScroll } from "@/components/infinite-scroll";
import { ProductSelect } from "@/components/product-select";

export const StockInsSection = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
        <ErrorBoundary fallback={<p>Error...</p>}>
          <StockInsSectionSuspense />
        </ErrorBoundary>
    </Suspense>
  )
}


const StockInsSectionSuspense = () => {
  const [ data, query ] = trpc.stockIns.getMany.useSuspenseInfiniteQuery({
    limit: DEFAULT_LIMIT,
  }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const [productId, setProductId] = useState("");
  const [stockInsQuantity, setStockInsQuantity] = useState<number | undefined>();

  const utils = trpc.useUtils();
  const create = trpc.stockIns.create.useMutation({
    onSuccess: () => {
      setProductId("");
      setStockInsQuantity(undefined);
      toast.success("Entrada criada com sucesso!");
      utils.stockIns.getMany.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return (
    <div>
      <div className="flex justify-center">
        <div className="m-4 flex w-[800px]">
          <ProductSelect 
            products={data.pages[0].productsData}
            onChange={setProductId} 
          />
          <Input className="m-2" type="number" placeholder="Valor" onChange={(e) => setStockInsQuantity(Number(e.target.value))}>
          </Input>
          <Button 
            className="m-2" 
            disabled={create.isPending}
            onClick={() => {
              if( !productId || stockInsQuantity === undefined ) {
                return;
              }
              create.mutate({productId: productId, quantity: stockInsQuantity})
            }}
            >
            {create.isPending ? <Loader2Icon className="animate-spin"/> : <PlusIcon />}
            Inserir nova entrada
          </Button>
        </div>
      </div>
      <div className="flex justify-center">
        <div>
          <Table>
            <TableCaption>Lista do estoque atualizado</TableCaption>
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
                      <TableCell className="font-medium">{row.stock_ins.createdAt.toLocaleString()}</TableCell>
                      <TableCell >{row.products.name}</TableCell>
                      <TableCell className="text-center">{row.stock_ins.quantity}</TableCell>
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