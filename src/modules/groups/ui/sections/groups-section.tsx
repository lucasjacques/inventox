import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
    <div className="pl-6">
      <p>Bem vindo a tela de grupos!</p>
      <Table>
        <TableCaption></TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groupsData.map((item) => {
            return (
            <TableRow>
              <TableCell key={item.id}>{item.name}</TableCell>
            </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}