"use client";

import { trpc } from "@/trpc/client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const StockInsSection = () => {
  const [ data ] = trpc.stockIns.getMany.useSuspenseQuery();

  return (
    <div>
      <div className="flex justify-center">
        <div className="m-4 flex w-[800px]">
          <Input className="m-2" type="text" placeholder="Produto">
          </Input>
          <Input  className="m-2" type="number" placeholder="Valor">
          </Input>
          <Button className="m-2">
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
            <TableRow>
              <TableCell className="font-medium w-[200px]">23/06/2025, 13:24:02</TableCell>
              <TableCell >BONITO -P- SACO DE 20 KG SACO RAFIA</TableCell>
              <TableCell className="text-center">69</TableCell>
              <TableCell className="text-center">Jane</TableCell>
            </TableRow>
            {data.map((row, index)=> {
              return (
                <TableRow key={index}>
                  <TableCell className="font-medium">{row.stock_ins.createdAt.toLocaleString()}</TableCell>
                  <TableCell >{row.products.name}</TableCell>
                  <TableCell className="text-center">{row.stock_ins.value}</TableCell>
                  <TableCell className="text-center">{row.users.name}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}