export type FinancialLineItem = {
  description: string
  value: number | string
  currency?: string
  unit?: string // e.g., "millions", "thousands"
}

export type FinancialData = {
  companyName: string
  period: string
  year: string
  incomeStatement: FinancialLineItem[]
  balanceSheet?: FinancialLineItem[] 
  cashFlow?: FinancialLineItem[]
  
  // Qualitative Analysis
  sentiment: "optimistic" | "cautious" | "neutral" | "pessimistic"
  confidenceDetail: "high" | "medium" | "low"
  keyPositives: string[]
  keyConcerns: string[]
  forwardGuidance: string // specific guidance on revenue, margin, capex
  capacityUtilization: string // trends or specific values
  growthInitiatives: string[] // 2-3 new initiatives
}

export type ExtractionResult = {
  data: FinancialData | null
  error?: string
}
