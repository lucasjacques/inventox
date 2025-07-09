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

type ActionsTableProps = {
  columns: string[],
  editValues: string[],
  editOnChange: Dispatch<SetStateAction<string>>,
  editEntity: ReturnType<typeof trpc.groups.update.useMutation>,
}

const data = [ 
  {
    name: "Grupo 1",
    products: "Produto 11",
    quantity: 6,
  }, 
  {
    name: "Grupo 2",
    products: "Produto 12",
    quantity: 7,
  }, 
  {
    name: "Grupo 3",
    products: "Produto 13",
    quantity: 8,
  }, 
  {
    name: "Grupo 4",
    products: "Produto 14",
    quantity: 9,
  }, 
  {
    name: "Grupo 5",
    products: "Produto 15",
    quantity: 10,
  }, 
]

export const ActionsTable = ({
    columns,
    editOnChange,
    editValues,
    editEntity,
  }: ActionsTableProps) => {
  
  return (
    <Table>
      <TableCaption>
        Lista de grupos atualizada
      </TableCaption>
      <TableHeader>
        <TableRow>
          {columns.map((key) => {
            return (
              <TableHead>{String(key)}</TableHead>
            )
          })}
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((items, index) => {
          return (
            <TableRow key={index}>
              {columns.map(() => {
                return (
                  <TableCell>{items.name}</TableCell>
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
                          <DialogTitle>Edição do Grupo: {items.name}</DialogTitle>
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
                          //   editEntity.mutate({ id: items.id, name: editValues[0] });
                          // }}
                        >
                          {/* {updateGroup.isPending ? <Loader2Icon className="animate-spin"/> : <PencilIcon />} */}
                          Editar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button variant="destructive" title="Excluir Item" 
                    // onClick={() => { deleteGroup.mutate({ id: items.id })}}
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