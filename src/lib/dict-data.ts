// Dictionary data for CRM system
// Functions are pre-built in dict.ts - only data here

export interface DictItem {
  label: string
  value: string
  color?: string
}

export const dictionaries: Record<string, DictItem[]> = {
  // Customer dictionaries
  "dict-customer-status": [
    { label: "潜在客户", value: "potential", color: "blue" },
    { label: "活跃客户", value: "active", color: "green" },
    { label: "非活跃", value: "inactive", color: "gray" },
  ],
  "dict-customer-type": [
    { label: "内贸", value: "domestic", color: "blue" },
    { label: "外贸", value: "export", color: "purple" },
  ],

  // Opportunity dictionaries
  "dict-opportunity-stage": [
    { label: "初步接触", value: "prospecting", color: "gray" },
    { label: "需求确认", value: "qualification", color: "blue" },
    { label: "方案报价", value: "proposal", color: "yellow" },
    { label: "商务谈判", value: "negotiation", color: "orange" },
    { label: "已成交", value: "closed-won", color: "green" },
    { label: "已失败", value: "closed-lost", color: "red" },
  ],

  // Contract dictionaries
  "dict-contract-type": [
    { label: "内贸", value: "domestic", color: "blue" },
    { label: "进口", value: "import", color: "purple" },
    { label: "出口", value: "export", color: "green" },
  ],
  "dict-contract-status": [
    { label: "草稿", value: "draft", color: "gray" },
    { label: "已签约", value: "signed", color: "blue" },
    { label: "执行中", value: "in-progress", color: "yellow" },
    { label: "已完成", value: "completed", color: "green" },
    { label: "已取消", value: "cancelled", color: "red" },
  ],
}
