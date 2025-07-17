import { StockOutsSection } from "../sections/stock-outs-section"

export const StockOutsView = () => {
  return (
    <div className="flex flex-col gap-y-3 pt-4">
       <div className="px-4">
        <h1 className="text-2xl font-bold">Saídas</h1>
       </div>
       <StockOutsSection />
    </div>
  )
}