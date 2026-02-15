import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { ExtractionResult, FinancialData } from "./types";

export async function extractFinancialData(
  apiKey: string,
  fileBase64: string,
  mimeType: string
): Promise<ExtractionResult> {
  if (!apiKey) {
    return { data: null, error: "Gemini API Key is missing" };
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  // List of models to try in order of preference
  const modelsToTry = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-flash-latest",
    "gemini-1.5-flash", 
    "gemini-1.5-pro",
    "gemini-pro-vision"
  ];

  let lastError: Error | null = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`Attempting to use model: ${modelName}`);
      const model: GenerativeModel = genAI.getGenerativeModel({ model: modelName });

      const prompt = `
        You are an expert financial analyst. Your task is to extract structured financial data from the provided document.
        Focus on the **Income Statement** (Consolidated Statement of Operations) for the most recent available year.

        extract the following line items exactly as they appear, or mapped to the closest standard equivalent:
      - Revenue (Total Net Sales / Revenue)
      - Cost of Goods Sold (Cost of Sales)
      - Gross Profit
      - Operating Expenses (Research & Development, SG&A, etc.)
      - Operating Income
      - Net Income

      **Qualitative Analysis:**
      Analyze the document deeply for the following qualitative insights. If specific sections aren't labeled, **infer** from the Management Discussion & Analysis (MD&A), Director's Report, or equivalent sections.
      
      1. **Management Tone/Sentiment**: Analyze the language used. Is it confident and growth-oriented ("optimistic"), careful and warning of risks ("cautious"), balanced ("neutral"), or focusing on decline/losses ("pessimistic")?
      2. **Confidence Level**: strict enum: "high", "medium", "low". Base this on the definitiveness of their forward-looking statements.
      3. **Key Positives**: Look for words like "growth", "record", "expansion", "profitability", "market share gain". List 3-5 highlights.
      4. **Key Concerns/Challenges**: Look for words like "headwinds", "inflation", "pressure", "decline", "geopolitical", "supply chain". List 3-5 risks.
      5. **Forward Guidance**: Synthesize any statements about the future outlook. Look for "expected", "projected", "outlook", "guidance", "target". If no numbers are given, describe the qualitative outlook (e.g., "Expects continued margin pressure"). **Do not say 'Not Mentioned' unless absolutely devoid of any future-looking statement.**
      6. **Capacity Utilization**: Look for details on manufacturing, plant operations, or efficiency. phrases like "operating leverage", "utilization rates", "production capacity". If not explicit, state "No specific utilization data found".
      7. **Growth Initiatives**: Identify strategic moves. New products, acquisitions, market expansions, digital transformation, capex plans. List 2-3 specific actions.

      **Output Format:**
      Return ONLY a valid JSON object with the following structure. Do not include markdown code blocks (like \`\`\`json).
      
      {
        "companyName": "extracted company name",
        "period": "extracted period (e.g., FY 2023, Q1 2024)",
        "year": "extracted fiscal year (e.g., 2023)",
        "incomeStatement": [
          {
            "description": "Revenue",
            "value": 123456,
            "originalDescription": "Net sales",
            "currency": "USD",
            "unit": "millions"
          },
          ...
        ],
        "sentiment": "optimistic",
        "confidenceDetail": "high",
        "keyPositives": ["positive 1", "positive 2", ...],
        "keyConcerns": ["concern 1", "concern 2", ...],
        "forwardGuidance": "Revenue expected to grow 5-7%, Margins to expand...",
        "capacityUtilization": "Currently at 85%...",
        "growthInitiatives": ["Initiative 1...", "Initiative 2..."]
      }

      If a value is negative (e.g., expenses), ensure the numeric value reflects that if appropriate, but typically financial statements show positive numbers for line items like "Cost of Sales". Use your judgment to represent it as a standard financial model would.
      If data is missing for a specific field, use "Not explicitly mentioned in specific terms" or similar descriptive text rather than just "Not Mentioned", unless it is truly absent.
      `;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: fileBase64,
            mimeType: mimeType,
          },
        },
      ]);

      const response = await result.response;
      const text = response.text();

      // Clean up markdown formatting if present
      const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();

      try {
        const data: FinancialData = JSON.parse(cleanJson);
        return { data };
      } catch (parseError) {
        console.error(`JSON Parse Error with model ${modelName}:`, parseError);
        // If JSON parsing fails, it might be a model output issue, but the model *worked*. 
        // We probably shouldn't retry with other models just for bad JSON unless we want to.
        // But let's assume if it got this far, the model exists.
        return { data: null, error: "Failed to parse API response as JSON" };
      }

    } catch (error: any) {
      console.warn(`Failed to use model ${modelName}:`, error.message);
      lastError = error;
      // Continue to next model
      if (error.message.includes("404") || error.message.includes("not found")) {
        continue;
      }
      // If it's a different error (e.g. auth), falling back might not help, but trying doesn't hurt.
    }
  }

  // If we get here, all models failed
  console.error("All Gemini models failed.");
  return { 
    data: null, 
    error: lastError ? (lastError as Error).message : "Failed to connect to any Gemini model. Please check your API key and region."
  };
}
