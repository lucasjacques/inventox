"use client"
import Image from "next/image";
import html2pdf from "html2pdf.js"
import { ErrorBoundary } from "react-error-boundary";
import { Suspense, useRef } from "react";

import { trpc } from "@/trpc/client"
import { DEFAULT_LIMIT } from "@/constants"
import { Button } from "@/components/ui/button";
import { GenericTable } from "@/components/generic-table";

export const InventorySection = () => {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <ErrorBoundary fallback={<p>Erro...</p>}>
        <InventorySectionSuspense />
      </ErrorBoundary>
    </Suspense>
  )
}

const InventorySectionSuspense = () => {
  const [ rawData ] = trpc.inventory.getMany.useSuspenseInfiniteQuery({
    limit: DEFAULT_LIMIT,
  }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const data = rawData.pages
    .flatMap( (page)=> page.items )
    .sort((a, b) => {
      const groupNameA = a.groups.name.toUpperCase() 
      const groupNameB = b.groups.name.toUpperCase() 
      if (groupNameA < groupNameB) {
        return -1;
      }
      if (groupNameA > groupNameB) {
        return 1;
      }

      const productNameA = a.products.name.toUpperCase();
      const productNameB = b.products.name.toUpperCase();
      if (productNameA < productNameB) {
        return -1;
      }
      if (productNameA > productNameB) {
        return 1;
      }
      
      return 0;
  });
  
  const tableRef = useRef<HTMLDivElement>(null)

  const handleDownloadPDF = () => {
    if (tableRef.current) {
      const opt = {
        margin: 0.5,
        filename: 'inventory.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: 'a4', orientation: 'portrait' }
      }

      html2pdf().set(opt).from(tableRef.current).save();
    }
  }

  const nowDate = Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(new Date());

  return (
    <div>
      <div className="flex justify-center m-4">
        <Button variant="blue" onClick={handleDownloadPDF}>
          Imprimir
        </Button>
      </div>
      <div className="flex justify-center">
        <div className="flex m-4">
          <GenericTable
            data={data}
            getColumns={(entry) => {
              return [
                entry.products.name,
                entry.quantity.toString(),
                entry.groups.name,
              ] 
            }}
            getId={(entry) => entry.products.id}
            headers={["Nome", "Quantidade", "Grupo"]}
            />
            </div>
      </div>
      <div className="justify-center hidden">
        <div ref={tableRef}>
          <div className="flex justify-between items-center w-full p-4 min-w-0">
            <Image width="200" height="100" unoptimized src="/amipesca-logo.png" alt="Amipesca Logo"/>
            <b className="text-2xl">{nowDate}</b>
          </div>
          <div className="flex m-4">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Nome</th>
                  <th className="border border-gray-300 px-4 py-2">Quantidade</th>
                  <th className="border border-gray-300 px-4 py-2">Grupo</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => {
                  return (
                    <tr key={row.products.id}>
                      <td className="border border-gray-300 px-4 py-2">{row.products.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{row.quantity}</td>
                      <td className="border border-gray-300 px-4 py-2">{row.groups.name}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}