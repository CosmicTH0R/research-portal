"use client";

import { useState } from "react";
import { UploadCloud, FileText, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  isProcessing: boolean;
  onProcess: () => void;
}

export function FileUploader({
  onFileSelect,
  selectedFile,
  onClear,
  apiKey,
  setApiKey,
  isProcessing,
  onProcess,
}: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg border shadow-sm space-y-4">
      <div className="space-y-2">
        <Label htmlFor="apiKey">Gemini API Key</Label>
        <Input
          id="apiKey"
          type="password"
          placeholder="AIza..."
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          disabled={isProcessing}
        />
        <p className="text-xs text-gray-500">
          Your key is used only for this session and never stored.
        </p>
      </div>

      <div
        className={cn(
          "relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:bg-gray-50",
          selectedFile ? "bg-green-50 border-green-300" : ""
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          onChange={handleChange}
          accept=".pdf,.txt"
          disabled={isProcessing}
        />

        {selectedFile ? (
          <div className="flex flex-col items-center space-y-2">
            <FileText className="w-10 h-10 text-green-600" />
            <span className="text-sm font-medium text-gray-700">
              {selectedFile.name}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              disabled={isProcessing}
            >
              <X className="w-4 h-4 mr-1" /> Remove
            </Button>
          </div>
        ) : (
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
          >
            <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500">PDF or TXT (MAX. 10MB)</p>
          </label>
        )}
      </div>

      <Button
        className="w-full"
        onClick={onProcess}
        disabled={!selectedFile || !apiKey || isProcessing}
      >
        {isProcessing ? "Processing..." : "Extract Financial Data"}
      </Button>
    </div>
  );
}
