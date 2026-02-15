import * as XLSX from "xlsx";
import { FinancialData } from "./types";

export function generateExcel(data: FinancialData): Buffer {
  const wb = XLSX.utils.book_new();

  // 1. Income Statement Sheet
  const wsIncome = XLSX.utils.json_to_sheet(data.incomeStatement);
  XLSX.utils.book_append_sheet(wb, wsIncome, "Income Statement");

  // 2. Qualitative Analysis Sheet
  const qualitativeData = [
    { Category: "Management Sentiment", Details: data.sentiment },
    { Category: "Confidence Level", Details: data.confidenceDetail },
    { Category: "Forward Guidance", Details: data.forwardGuidance },
    { Category: "Capacity Utilization", Details: data.capacityUtilization },
    ...data.keyPositives.map((p, i) => ({ Category: `Key Positive ${i + 1}`, Details: p })),
    ...data.keyConcerns.map((c, i) => ({ Category: `Key Concern ${i + 1}`, Details: c })),
    ...data.growthInitiatives.map((g, i) => ({ Category: `Growth Initiative ${i + 1}`, Details: g })),
  ];

  const wsQualitative = XLSX.utils.json_to_sheet(qualitativeData);
  XLSX.utils.book_append_sheet(wb, wsQualitative, "Qualitative Analysis");

  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  return buffer;
}
