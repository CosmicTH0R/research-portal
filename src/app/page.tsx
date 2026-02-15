"use client";

import { useState } from "react";
import { FileUploader } from "@/components/file-uploader";
import { FinancialData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [data, setData] = useState<FinancialData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async () => {
    if (!file || !apiKey) return;

    setIsProcessing(true);
    setError(null);
    setData(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("apiKey", apiKey);

    try {
      const response = await fetch("/api/process-document", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process document");
      }

      const result = await response.json();
      setData(result);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!data) return;

    try {
      const response = await fetch("/api/download-excel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to generate Excel");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.companyName || "Financial"}_${data.year || "Data"}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Financial Statement Extractor
          </h1>
          <p className="text-slate-500">
            Upload an Annual Report (PDF) or financial text to extract structured
            line items.
          </p>
        </div>

        <FileUploader
          onFileSelect={setFile}
          selectedFile={file}
          onClear={() => {
            setFile(null);
            setData(null);
            setError(null);
          }}
          apiKey={apiKey}
          setApiKey={setApiKey}
          isProcessing={isProcessing}
          onProcess={handleProcess}
        />

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200 text-sm">
            Error: {error}
          </div>
        )}

        {isProcessing && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-sm text-slate-500">
              Analyzing document with AI... This may take a moment.
            </p>
          </div>
        )}

        {data && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Financial Data Table */}
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
              <div className="p-6 border-b bg-slate-50 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {data.companyName} - {data.period} ({data.year})
                  </h2>
                  <p className="text-sm text-slate-500">
                    Extracted Income Statement
                  </p>
                </div>
                <Button onClick={handleDownload} className="gap-2">
                  <Download className="w-4 h-4" />
                  Download Excel
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                    <tr>
                      <th className="px-6 py-3 font-medium">Line Item</th>
                      <th className="px-6 py-3 font-medium text-right">Value</th>
                      <th className="px-6 py-3 font-medium text-right">Unit/Currency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.incomeStatement.map((item, index) => (
                      <tr key={index} className="hover:bg-slate-50/50">
                        <td className="px-6 py-3 font-medium text-slate-900">
                          {item.description}
                        </td>
                        <td className="px-6 py-3 text-right font-mono text-slate-700">
                          {item.value.toLocaleString()}
                        </td>
                        <td className="px-6 py-3 text-right text-slate-500">
                          {item.currency} {item.unit ? `(${item.unit})` : ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Qualitative Analysis Section */}
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden p-6 space-y-6">
              <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">
                Executive Summary & Qualitative Insights
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tone & Confidence */}
                <div className="space-y-2">
                  <h4 className="font-medium text-slate-700">Management Sentiment</h4>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium capitalize",
                      data.sentiment === "optimistic" ? "bg-green-100 text-green-800" :
                      data.sentiment === "pessimistic" ? "bg-red-100 text-red-800" :
                      data.sentiment === "cautious" ? "bg-amber-100 text-amber-800" :
                      "bg-gray-100 text-gray-800"
                    )}>
                      {data.sentiment}
                    </span>
                    <span className="text-sm text-slate-500">
                      Confidence: <strong>{data.confidenceDetail}</strong>
                    </span>
                  </div>
                </div>

                {/* Forward Guidance */}
                 <div className="space-y-2">
                  <h4 className="font-medium text-slate-700">Forward Guidance</h4>
                  <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-md border">
                    {data.forwardGuidance || "Not mentioned"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Positives */}
                <div className="space-y-2">
                  <h4 className="font-medium text-green-700 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" /> Key Positives
                  </h4>
                  <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                    {data.keyPositives?.map((item, i) => (
                      <li key={i}>{item}</li>
                    )) || <li>None detail extracted</li>}
                  </ul>
                </div>

                {/* Concerns */}
                <div className="space-y-2">
                  <h4 className="font-medium text-red-700 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" /> Key Concerns
                  </h4>
                  <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                    {data.keyConcerns?.map((item, i) => (
                      <li key={i}>{item}</li>
                    )) || <li>None detail extracted</li>}
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Growth Initiatives */}
                 <div className="space-y-2">
                  <h4 className="font-medium text-blue-700">Growth Initiatives</h4>
                  <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                    {data.growthInitiatives?.map((item, i) => (
                      <li key={i}>{item}</li>
                    )) || <li>Not mentioned</li>}
                  </ul>
                </div>

                {/* Capacity Utilization */}
                <div className="space-y-2">
                  <h4 className="font-medium text-purple-700">Capacity Utilization</h4>
                  <p className="text-sm text-slate-600  p-2">
                    {data.capacityUtilization || "Not mentioned"}
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </main>
  );
}
