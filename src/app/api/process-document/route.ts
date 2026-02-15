import { NextRequest, NextResponse } from "next/server";
import { extractFinancialData } from "@/lib/llm";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const apiKey = formData.get("apiKey") as string;

    if (!file || !apiKey) {
      return NextResponse.json(
        { error: "File and API Key are required" },
        { status: 400 }
      );
    }

    // Convert file to base64 for Gemini API
    const arrayBuffer = await file.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = file.type;

    const result = await extractFinancialData(apiKey, base64String, mimeType);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    
    return NextResponse.json(result.data);
  } catch (error: unknown) {
    console.error("Error processing document:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to process document" },
      { status: 500 }
    );
  }
}
