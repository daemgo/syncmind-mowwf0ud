// Opportunity type definitions

export interface Opportunity {
  id: string
  code: string
  name: string
  customerId: string
  customerName: string
  stage: "prospecting" | "qualification" | "proposal" | "negotiation" | "closed-won" | "closed-lost"
  amount: number
  expectedCloseDate: string
  probability: number
  createdAt: string
  updatedAt: string
}

export type OpportunityStage = Opportunity["stage"]
