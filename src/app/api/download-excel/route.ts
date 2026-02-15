import { NextRequest, NextResponse } from "next/server";
import { generateExcel } from "@/lib/xlsx";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const buffer = generateExcel(data);
    
    return new NextResponse(new Blob([new Uint8Array(buffer)]), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${data.companyName || 'Financial_Data'}_${data.year || 'Report'}.xlsx"`,
      },
    });
  } catch (error: unknown) {
     return NextResponse.json(
      { error: (error as Error).message || "Failed to generate Excel" },
      { status: 500 }
    );
  }
}
