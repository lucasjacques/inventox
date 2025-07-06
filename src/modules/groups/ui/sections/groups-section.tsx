"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const groupsData = [
  {
    id: "123123123",
    name: "Grupo1"
  },
  {
    id: "123123124",
    name: "Grupo2"
  },
  {
    id: "123123125",
    name: "Grupo3"
  },
  {
    id: "123123126",
    name: "Grupo4"
  },
  {
    id: "123123127",
    name: "Grupo5"
  },
]

export const GroupsSection = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
        <ErrorBoundary fallback={<p>Error...</p>}>
          <GroupsSectionSuspense />
        </ErrorBoundary>
    </Suspense>
  )
}


const GroupsSectionSuspense = () => {
  const [ data, query ] = trpc.groups.getMany.useSuspenseInfiniteQuery({
    limit: DEFAULT_LIMIT,
  }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  return (
    <div>
      <div className="flex justify-center">
        <div className="m-4 flex w-[500px]">
          <Input className="m-2" type="text" />
          <Button className="m-2">Inserir novo grupo</Button>
        </div>

      </div>
      <div className="flex justify-center">
        <div className="m-4 flex w-[800px]">
          <Table>
            <TableCaption>
              Lista de grupos atualizada
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.pages.flatMap((page) => page.items).map((items, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{items.name}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="pl-6">
      </div>
    </div>
  )
}