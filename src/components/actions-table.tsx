import { Loader2Icon, PencilIcon, XIcon } from "lucide-react";
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
import { Dispatch, MouseEventHandler, SetStateAction } from "react";
import { trpc } from "@/trpc/client";
import { DialogDescription } from "@radix-ui/react-dialog";
import { capitalizeFirstLetter } from "@/lib/utils";

type ActionsTableProps<T extends object> = {
  data: T[];
  getId: (item: T) => string;
  onEdit: (item: T) => void;
  getName: (item: T) => string;
  headers: string[];
  onDelete: (item: T) => void;
  dialogEditInputs: { 
    label: string;
    type: string;
    placeholder: string;
    onChange: (s: string) => void;
  }[];
  getColumns: (item: T) => string[];
  editMutation: { isPending: boolean };
  deleteMutation: { isPending: boolean }
}

export function ActionsTable<T extends object> ({
    data,
    getId,
    onEdit,
    getName,
    headers,
    onDelete,
    dialogEditInputs,
    getColumns,
    editMutation,
    deleteMutation,
  }: ActionsTableProps<T>) {
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headers.map((header, index) => {
            return (
              <TableHead key={index} >{header}</TableHead>
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
              {getColumns(row).map((cell, index2) => {
                return (
                  <TableCell key={getId(row)}>{String(cell)}</TableCell>
                )
              })}
              <TableCell>
                <div className="flex gap-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="blue" title="Editar Item">
                        <PencilIcon />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[350px]">
                      <DialogHeader>
                          <DialogTitle>Edição do Item: {getName(row)}</DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col gap-3">
                        {dialogEditInputs.map((inputs, index3)=>{
                          return (
                            <div key={index3}>
                              <Label>{capitalizeFirstLetter(inputs.label)}</Label>
                              <Input
                                type={inputs.type}
                                placeholder={inputs.placeholder}
                                onChange={(e) => inputs.onChange(e.target.value)}
                                />
                            </div> 
                          )
                        })}
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancelar</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button variant="blue" onClick={() => onEdit(row)}
                          >
                            {editMutation.isPending ? <Loader2Icon className="animate-spin"/> : <PencilIcon />}
                            Editar
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive" title="Excluir Item">
                        <XIcon />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          Exclusão de item: {getName(row)}
                        </DialogTitle>
                      </DialogHeader>
                      <DialogDescription>
                        Você tem certeza que deseja excluir o item em questão?
                      </DialogDescription>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancelar</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button variant="destructive" onClick={() => onDelete(row)}>
                            {deleteMutation.isPending ? <Loader2Icon className="animate-spin"/> : <XIcon />}
                            Excluir
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}