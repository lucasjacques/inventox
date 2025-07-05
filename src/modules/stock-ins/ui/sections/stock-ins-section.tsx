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
  TableRow,
} from "@/components/ui/table"
import { InfiniteScroll } from "@/components/infinite-scroll";

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
  const [stockInsValue, setStockInsValue] = useState<number | undefined>();

  const utils = trpc.useUtils();
  const create = trpc.stockIns.create.useMutation({
    onSuccess: () => {
      setProductId("");
      setStockInsValue(undefined);
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
          <Select onValueChange={(value) => setProductId(value)}>
            <SelectTrigger className="m-2">
              <SelectValue placeholder="Selecione um Produto" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {data.pages[0].productsData.map((product, index)=> {
                  return (
                    <SelectItem key={index} value={product.id}>{product.name}</SelectItem>
                  )
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input className="m-2" type="number" placeholder="Valor" onChange={(e) => setStockInsValue(Number(e.target.value))}>
          </Input>
          <Button 
            className="m-2" 
            disabled={create.isPending}
            onClick={() => {
              if( !productId || stockInsValue === undefined ) {
                return;
              }
              create.mutate({productId: productId, value: stockInsValue})
            }}
            >
            {create.isPending ? <Loader2Icon className="animate-spin"/> : <PlusIcon />}
            Inserir nova entrada
          </Button>
        </div>
      </div>
      <div className="pl-6">
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
                    <TableCell className="text-center">{row.stock_ins.value}</TableCell>
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
  )
}