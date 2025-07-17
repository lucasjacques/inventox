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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

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
  const [stockOutsValue, setStockOutsValue] = useState<number | undefined>();

  const utils = trpc.useUtils();
  const create = trpc.stockOuts.create.useMutation({
    onSuccess: () => {
      setProductId("");
      setStockOutsValue(undefined);
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
          <Input className="m-2" type="number" placeholder="Valor" onChange={(e) => setStockOutsValue(Number(e.target.value))}>
          </Input>
          <Button 
            className="m-2" 
            disabled={create.isPending}
            onClick={() => {
              if( !productId || stockOutsValue === undefined ) {
                return;
              }
              create.mutate({productId: productId, value: stockOutsValue})
            }}
            >
            {create.isPending ? <Loader2Icon className="animate-spin"/> : <PlusIcon />}
            Inserir nova saída
          </Button>
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
                      <TableCell className="text-center">{row.stock_outs.value}</TableCell>
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