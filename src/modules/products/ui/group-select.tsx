import { Group } from "@/modules/groups/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface GroupSelectProps {
  groups: Group[]
  onChange: (s: string) => void,
}

export const GroupSelect = ({
  groups,
  onChange,
}: GroupSelectProps) => {
  return (
  <Select onValueChange={(value) => onChange(value)}>
    <SelectTrigger className="m-2 max-w-[300px]" >
      <SelectValue placeholder="Selecione um grupo" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        {groups.map((group, index) => {
          return (
            <SelectItem key={index} value={group.id}>{group.name}</SelectItem>
          )
        })}
      </SelectGroup>
    </SelectContent>
  </Select>
  );
}