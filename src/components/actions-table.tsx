import { PencilIcon, XIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "./ui/table";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Dispatch, SetStateAction } from "react";
import { trpc } from "@/trpc/client";

type ActionsTableProps<T extends object> = {
  data: T[];
  getName: (row: T) => string;
  headers: string[];
  editEntity: ReturnType<typeof trpc.groups.update.useMutation>;
  editValues: string[];
  editOnChange: Dispatch<SetStateAction<string>>;
}

export function ActionsTable<T extends object> ({
    data,
    getName,
    headers,
    editEntity,
    editValues,
    editOnChange,
  }: ActionsTableProps<T>) {
  
  return (
    <Table>
      <TableCaption>
        Lista de grupos atualizada
      </TableCaption>
      <TableHeader>
        <TableRow>
          {headers.map((header) => {
            return (
              <TableHead>{String(header)}</TableHead>
            )
          })}
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, index) => {
          const columns = Object.keys(row) as Array<keyof T>;
          return (
            <TableRow key={index}>
              {columns.map((cell, index2) => {
                return (
                  <TableCell key={index2}>{String(row[cell])}</TableCell>
                )
              })}
              <TableCell>
                <div className="flex gap-3">
                  <Dialog>
                    <DialogTrigger>
                      <Button variant="blue" title="Editar Item">
                        <PencilIcon />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[350px]">
                      <DialogHeader>
                          <DialogTitle>Edição do Grupo: {getName(row)}</DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col gap-3">
                        <Label>Nome:</Label>
                        <Input
                          type="text"
                          placeholder="Escreva um nome para o grupo"
                          onChange={(e) => editOnChange(e.target.value)}
                        />
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button 
                          // onClick={() => {
                          //   if (!editValues[0]) {
                          //     return;
                          //   }
                          //   editEntity.mutate({ id: row.id, name: editValues[0] });
                          // }}
                        >
                          {/* {updateGroup.isPending ? <Loader2Icon className="animate-spin"/> : <PencilIcon />} */}
                          Editar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button variant="destructive" title="Excluir Item" 
                    // onClick={() => { deleteGroup.mutate({ id: row.id })}}
                  >
                        <XIcon />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}