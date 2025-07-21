import { InventorySection } from "../sections/inventory-section"

export const InventoryView = () => {
  return (
    <div className="flex flex-col gap-y-3 pt-4">
      <div className="px-4">
        <h1 className="text-2xl font-bold">Estoque</h1>
      </div>
      <InventorySection />
    </div>
  )
}