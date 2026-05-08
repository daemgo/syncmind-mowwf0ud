import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DataTable, type ColumnConfig } from "@/components/biz/data-table"
import { DataFilter, type FilterField } from "@/components/biz/data-filter"
import { FormDialog, type FormField } from "@/components/biz/form-dialog"
import { customerMock } from "@/mock/customer"
import type { Customer } from "@/types/customer"

export const Route = createFileRoute("/customers/")({
  component: CustomerPage,
})

// Column configuration
const columns: ColumnConfig<Customer>[] = [
  { key: "code", label: "客户编号", type: "mono" },
  { key: "name", label: "客户名称" },
  { key: "type", label: "类型", type: "badge", dictId: "dict-customer-type" },
  { key: "status", label: "状态", type: "badge", dictId: "dict-customer-status" },
  { key: "contact", label: "联系人" },
  { key: "phone", label: "联系电话" },
  { key: "paymentDays", label: "账期(天)", align: "right" },
  { key: "createdAt", label: "创建日期", type: "date" },
]

// Filter configuration
const filterFields: FilterField[] = [
  { key: "name", label: "客户名称", type: "text" },
  { key: "type", label: "客户类型", type: "select", dictId: "dict-customer-type" },
  { key: "status", label: "客户状态", type: "select", dictId: "dict-customer-status" },
]

// Form configuration
const formFields: FormField[] = [
  { key: "name", label: "客户名称", type: "text", required: true },
  { key: "code", label: "客户编号", type: "text", required: true },
  { key: "type", label: "客户类型", type: "select", dictId: "dict-customer-type", required: true },
  { key: "status", label: "客户状态", type: "select", dictId: "dict-customer-status", required: true },
  { key: "contact", label: "联系人", type: "text" },
  { key: "phone", label: "联系电话", type: "text" },
  { key: "email", label: "邮箱", type: "text" },
  { key: "address", label: "地址", type: "text" },
  { key: "creditLimit", label: "信用额度", type: "number" },
  { key: "paymentDays", label: "账期(天)", type: "number" },
]

function CustomerPage() {
  const navigate = useNavigate()
  const [data] = useState(customerMock)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Customer | undefined>()
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
          <h1 className="text-2xl font-bold">客户管理</h1>
          <p className="text-muted-foreground">管理所有客户信息和档案</p>
        </div>
        <Button onClick={() => { setEditingItem(undefined); setDialogOpen(true) }}>
          <Plus className="mr-2 h-4 w-4" />新建客户
        </Button>
      </div>

      <DataFilter fields={filterFields} values={filters} onChange={setFilters} />

      <DataTable
        columns={columns}
        data={filtered}
        onView={(item) => navigate({ to: "/customers/$id", params: { id: item.id } })}
        onEdit={(item) => { setEditingItem(item); setDialogOpen(true) }}
      />

      <FormDialog
        entityName="客户"
        fields={formFields}
        data={editingItem}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}
