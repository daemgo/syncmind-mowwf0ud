// Contract type definitions

export interface Contract {
  id: string
  code: string
  name: string
  customerId: string
  customerName: string
  opportunityId?: string
  type: "domestic" | "import" | "export"
  amount: number
  signedDate: string
  deliveryDate: string
  status: "draft" | "signed" | "in-progress" | "completed" | "cancelled"
  paidAmount: number
  createdAt: string
  updatedAt: string
}

export type ContractType = Contract["type"]
export type ContractStatus = Contract["status"]
