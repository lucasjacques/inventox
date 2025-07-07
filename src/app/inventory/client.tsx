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
    name: "BONITO -P- SACO DE 20 KG SACO RAFIA",
    price: "6,00",
    entry: 69,
    exit: 0,
    total: 69,
    boxes: 20,
    totalKg: 1380,
  },
  {
    name: "BONITO -P- SACO DE 20 KG SACO RAFIA",
    price: "6,00",
    entry: 69,
    exit: 0,
    total: 69,
    boxes: 20,
    totalKg: 1380,
  },
  {
    name: "BONITO -P- SACO DE 20 KG SACO RAFIA",
    price: "6,00",
    entry: 69,
    exit: 0,
    total: 69,
    boxes: 20,
    totalKg: 1380,
  },
  {
    name: "BONITO -P- SACO DE 20 KG SACO RAFIA",
    price: "6,00",
    entry: 69,
    exit: 0,
    total: 69,
    boxes: 20,
    totalKg: 1380,
  },
]

export const PageClient = () => {

  return (
      <div>
        <div className="h-16"></div>
        <div className="flex justify-center">
          <div>
            <Table>
              <TableCaption>Lista do estoque atualizado</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Nome</TableHead>
                  <TableHead className="text-center w-[50px]">Preço</TableHead>
                  <TableHead className="text-center w-[50px]">Entrada</TableHead>
                  <TableHead className="text-center w-[50px]">Saída</TableHead>
                  <TableHead className="text-center w-[50px]">Saldo Final</TableHead>
                  <TableHead className="text-center w-[50px]">Qtd Caixas</TableHead>
                  <TableHead className="text-center w-[50px]">Peso Kgs</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium w-[200px]">BONITO -P- SACO DE 20 KG SACO RAFIA 6,00</TableCell>
                  <TableCell className="text-center">6,00</TableCell>
                  <TableCell className="text-center">69</TableCell>
                  <TableCell className="text-center">0</TableCell>
                  <TableCell className="text-center">69</TableCell>
                  <TableCell className="text-center">20</TableCell>
                  <TableCell className="text-center">1380</TableCell>
                </TableRow>
                {tableData.map((row, index)=> {
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell className="text-center font-medium text-xl text-red-500 "><b>{row.price}</b></TableCell>
                      <TableCell className="text-center">{row.entry}</TableCell>
                      <TableCell className="text-center">{row.exit}</TableCell>
                      <TableCell className="text-center">{row.total}</TableCell>
                      <TableCell className="text-center">{row.boxes}</TableCell>
                      <TableCell className="text-center">{row.totalKg}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
  )
}