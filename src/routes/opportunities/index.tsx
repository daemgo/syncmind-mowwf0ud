import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DataTable, type ColumnConfig } from "@/components/biz/data-table"
import { DataFilter, type FilterField } from "@/components/biz/data-filter"
import { FormDialog, type FormField } from "@/components/biz/form-dialog"
import { opportunityMock } from "@/mock/opportunity"
import type { Opportunity } from "@/types/opportunity"

export const Route = createFileRoute("/opportunities/")({
  component: OpportunityPage,
})

// Column configuration
const columns: ColumnConfig<Opportunity>[] = [
  { key: "code", label: "商机编号", type: "mono" },
  { key: "name", label: "商机名称" },
  { key: "customerName", label: "客户名称" },
  { key: "stage", label: "阶段", type: "badge", dictId: "dict-opportunity-stage" },
  { key: "amount", label: "金额", type: "money", align: "right" },
  { key: "probability", label: "赢单概率", align: "right" },
  { key: "expectedCloseDate", label: "预计成交", type: "date" },
]

// Filter configuration
const filterFields: FilterField[] = [
  { key: "name", label: "商机名称", type: "text" },
  { key: "stage", label: "商机阶段", type: "select", dictId: "dict-opportunity-stage" },
  { key: "customerName", label: "客户名称", type: "text" },
]

// Form configuration
const formFields: FormField[] = [
  { key: "name", label: "商机名称", type: "text", required: true },
  { key: "customerName", label: "客户名称", type: "text", required: true },
  { key: "stage", label: "商机阶段", type: "select", dictId: "dict-opportunity-stage", required: true },
  { key: "amount", label: "金额", type: "number", required: true },
  { key: "probability", label: "赢单概率(%)", type: "number" },
  { key: "expectedCloseDate", label: "预计成交日期", type: "date" },
]

function OpportunityPage() {
  const navigate = useNavigate()
  const [data] = useState(opportunityMock)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Opportunity | undefined>()
  const [filters, setFilters] = useState<Record<string, string>>({})

  // Simple client-side filtering
  const filtered = data.filter((item) => {
    return Object.entries(filters).every(([key, val]) => {
      if (!val) return true
      const fieldVal = String((item as Record<string, unknown>)[key] ?? "")
      return fieldVal.toLowerCase().includes(val.toLowerCase())
    })
  })

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">商机管理</h1>
          <p className="text-muted-foreground">跟踪销售机会和跟进进度</p>
        </div>
        <Button onClick={() => { setEditingItem(undefined); setDialogOpen(true) }}>
          <Plus className="mr-2 h-4 w-4" />新建商机
        </Button>
      </div>

      <DataFilter fields={filterFields} values={filters} onChange={setFilters} />

      <DataTable
        columns={columns}
        data={filtered}
        onView={(item) => navigate({ to: "/opportunities/$id", params: { id: item.id } })}
        onEdit={(item) => { setEditingItem(item); setDialogOpen(true) }}
      />

      <FormDialog
        entityName="商机"
        fields={formFields}
        data={editingItem}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}
