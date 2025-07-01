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

const tableData = [
  {
    date: "23/06/2025 as 13h24",
    product: "BONITO -P- SACO DE 20 KG SACO RAFIA",
    quantity: 69,
    author: "Jane",
  },
  {
    date: "23/06/2025 as 13h24",
    product: "BONITO -P- SACO DE 20 KG SACO RAFIA",
    quantity: 69,
    author: "Jane",
  },
  {
    date: "23/06/2025 as 13h24",
    product: "BONITO -P- SACO DE 20 KG SACO RAFIA",
    quantity: 69,
    author: "Jane",
  },
  {
    date: "23/06/2025 as 13h24",
    product: "BONITO -P- SACO DE 20 KG SACO RAFIA",
    quantity: 69,
    author: "Jane",
  },
]

export const PageClient = () => {
  const [ data ] = trpc.stockIns.getMany.useSuspenseQuery();

  return (
    <div>
      <div className="h-16"></div>
      <div className="pl-6">
        <Table>
          <TableCaption>Lista do estoque atualizado</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Data</TableHead>
              <TableHead className="text-center">Produto</TableHead>
              <TableHead className="text-center w-[50px]">Quantidade</TableHead>
              <TableHead className="text-center w-[50px]">Autor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium w-[200px]">23/06/2025 as 13h24</TableCell>
              <TableCell className="text-center">BONITO -P- SACO DE 20 KG SACO RAFIA</TableCell>
              <TableCell className="text-center">69</TableCell>
              <TableCell className="text-center">Jane</TableCell>
            </TableRow>
            {tableData.map((row, index)=> {
              return (
                <TableRow key={index}>
                  <TableCell className="font-medium">{row.date}</TableCell>
                  <TableCell className="text-center">{row.product}</TableCell>
                  <TableCell className="text-center">{row.quantity}</TableCell>
                  <TableCell className="text-center">{row.author}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
          </div>
      Page client says: {JSON.stringify(data)}
    </div>
  )
}