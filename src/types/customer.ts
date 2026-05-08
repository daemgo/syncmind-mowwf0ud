// Customer type definitions

export interface Customer {
  id: string
  code: string
  name: string
  type: "domestic" | "export"
  status: "potential" | "active" | "inactive"
  contact: string
  phone: string
  email: string
  address: string
  creditLimit: number
  paymentDays: number
  createdAt: string
  updatedAt: string
}

export type CustomerStatus = Customer["status"]
export type CustomerType = Customer["type"]
