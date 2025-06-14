import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary'
import { PageClient } from './client';
import { HydrateClient, trpc } from "@/trpc/server";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const data = [
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

export default async function Home() {

  void trpc.hello.prefetch({ text: "Lucas2" })

  return(
    <HydrateClient>
      <Suspense fallback={<p>Loading...</p>}>
        <ErrorBoundary fallback={<p>Error...</p>}>
    <div>
      <div className="h-16"></div>
      <div className="pl-6">
        <Table>
          <TableCaption>Lista do estoque atualizado</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="w-[50px]">Preço</TableHead>
              <TableHead className="w-[50px]">Entrada</TableHead>
              <TableHead className="w-[50px]">Saída</TableHead>
              <TableHead className="text-right w-[50px]">Saldo Final</TableHead>
              <TableHead className="text-center w-[50px]">Qtd Caixas</TableHead>
              <TableHead className="text-right w-[50px]">Peso Kgs</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">BONITO -P- SACO DE 20 KG SACO RAFIA 6,00</TableCell>
              <TableCell>6,00</TableCell>
              <TableCell>69</TableCell>
              <TableCell className="text-center">0</TableCell>
              <TableCell className="text-center">69</TableCell>
              <TableCell className="text-center">20</TableCell>
              <TableCell className="text-center">1380</TableCell>
            </TableRow>
            {data.map((row)=> {
              return (
                <TableRow>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="font-medium text-xl text-red-500 "><b>{row.price}</b></TableCell>
                  <TableCell>{row.entry}</TableCell>
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
      <PageClient />
    </div>
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  );
}
