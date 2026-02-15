const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.argv[2];
if (!apiKey) {
  console.error("Please provide an API key as an argument.");
  console.error("Usage: node test-gemini.js YOUR_API_KEY");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
  console.log("Checking available Gemini models for your API Key...");
  
  // List of models to test
  const models = [
    "gemini-1.5-flash", 
    "gemini-1.5-flash-001", 
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro",
    "gemini-pro"
  ];
  
  for (const modelName of models) {
    console.log(`\nTesting model: ${modelName}`);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hello, simply reply 'OK'.");
      const response = await result.response;
      console.log(`✅ SUCCESS! Model '${modelName}' is working.`);
      console.log(`   Response: ${response.text().trim()}`);
    } catch (error) {
       console.error(`❌ FAILED: ${error.message}`);
       if (error.message.includes("404")) {
         console.error("   -> Model not found or not supported/enabled for your API coin.");
       }
    }
  }
  console.log("\nDiagnostic complete.");
}

run();
