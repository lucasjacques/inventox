import { GroupsSection } from "../sections/groups-section"

export const GroupsView = () => {
  return (
    <div className="flex flex-col gap-y-3 pt-4">
      <div className="px-4">
        <h1 className="text-2xl font-bold">Grupos</h1>
      </div>
      <GroupsSection />
    </div>
  )
}