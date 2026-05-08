import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DataTable, type ColumnConfig } from "@/components/biz/data-table"
import { DataFilter, type FilterField } from "@/components/biz/data-filter"
import { FormDialog, type FormField } from "@/components/biz/form-dialog"
import { contractMock } from "@/mock/contract"
import type { Contract } from "@/types/contract"

export const Route = createFileRoute("/contracts/")({
  component: ContractPage,
})

// Column configuration
const columns: ColumnConfig<Contract>[] = [
  { key: "code", label: "合同编号", type: "mono" },
  { key: "name", label: "合同名称" },
  { key: "customerName", label: "客户名称" },
  { key: "type", label: "类型", type: "badge", dictId: "dict-contract-type" },
  { key: "amount", label: "合同金额", type: "money", align: "right" },
  { key: "status", label: "状态", type: "badge", dictId: "dict-contract-status" },
  { key: "signedDate", label: "签约日期", type: "date" },
]

// Filter configuration
const filterFields: FilterField[] = [
  { key: "name", label: "合同名称", type: "text" },
  { key: "type", label: "合同类型", type: "select", dictId: "dict-contract-type" },
  { key: "status", label: "合同状态", type: "select", dictId: "dict-contract-status" },
  { key: "customerName", label: "客户名称", type: "text" },
]

// Form configuration
const formFields: FormField[] = [
  { key: "name", label: "合同名称", type: "text", required: true },
  { key: "code", label: "合同编号", type: "text", required: true },
  { key: "customerName", label: "客户名称", type: "text", required: true },
  { key: "type", label: "合同类型", type: "select", dictId: "dict-contract-type", required: true },
  { key: "amount", label: "合同金额", type: "number", required: true },
  { key: "status", label: "合同状态", type: "select", dictId: "dict-contract-status", required: true },
  { key: "signedDate", label: "签约日期", type: "date" },
  { key: "deliveryDate", label: "交付日期", type: "date" },
]

function ContractPage() {
  const navigate = useNavigate()
  const [data] = useState(contractMock)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Contract | undefined>()
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
          <h1 className="text-2xl font-bold">合同管理</h1>
          <p className="text-muted-foreground">管理销售合同和应收账款</p>
        </div>
        <Button onClick={() => { setEditingItem(undefined); setDialogOpen(true) }}>
          <Plus className="mr-2 h-4 w-4" />新建合同
        </Button>
      </div>

      <DataFilter fields={filterFields} values={filters} onChange={setFilters} />

      <DataTable
        columns={columns}
        data={filtered}
        onView={(item) => navigate({ to: "/contracts/$id", params: { id: item.id } })}
        onEdit={(item) => { setEditingItem(item); setDialogOpen(true) }}
      />

      <FormDialog
        entityName="合同"
        fields={formFields}
        data={editingItem}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}
