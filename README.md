# Research Portal - Financial Statement Extractor

A minimal research portal that leverages **AI (Google Gemini)** to extract structured financial data and qualitative insights from unstructured documents (PDF/Text). Designed for financial analysts to quickly convert reports into usable Excel models.

## 🚀 Features

### 1. Financial Data Extraction
-   Automatically extracts key **Income Statement** line items:
    -   Revenue, COGS, Gross Profit, Operating Expenses, Operating Income, Net Income.
-   Handles complex PDF layouts using Gemini's multimodal capabilities.

### 2. Qualitative Analysis (New!)
-   **Management Sentiment**: Analyzes tone (Optimistic/Cautious) and confidence levels.
-   **Forward Guidance**: Extracts specific outlooks on revenue, margins, and CAPEX.
-   **Key Insights**: Summarizes top positives and concerns from the report.
-   **Growth Initiatives**: Identifies strategic moves and efficiency trends (Capacity Utilization).

### 3. Structured Export
-   **Download as Excel (.xlsx)**:
    -   **Sheet 1**: Financial Data (Formatted Table).
    -   **Sheet 2**: Qualitative Analysis (Detailed insights).

---

## 🛠️ Tech Stack

-   **Frontend**: Next.js 14, React, Tailwind CSS, Shadcn UI
-   **Backend**: Next.js API Routes (Serverless)
-   **AI Engine**: Google Gemini API (`gemini-2.0-flash`, `gemini-1.5-flash`)
-   **Processing**: Multimodal PDF Ingestion (No external OCR needed)
-   **Export**: `xlsx` library

---

## ⚡ Setup Guide

### Prerequisites
-   Node.js 18+
-   A **Google Gemini API Key** (Get it from [Google AI Studio](https://aistudio.google.com/app/apikey))

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/CosmicTH0R/research-portal.git
    cd research-portal
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Open the App**:
    Navigate to [http://localhost:3000](http://localhost:3000).

---

## 📖 Usage

1.  **Enter API Key**: Input your Gemini API Key (starts with `AIza...`). Keys are not stored.
2.  **Upload Document**: Drag & drop a PDF (e.g., Annual Report, 10-K) or Text file.
3.  **Process**: Click "Extract Financial Data".
4.  **Review**:
    -   See the extracted Income Statement table.
    -   Scroll down for Executive Summary & Qualitative Insights.
5.  **Export**: Click "Download Excel" to save the analysis.

---

## 🔧 Troubleshooting

-   **"Model Not Found" (404)**:
    -   Ensure your API Key has access to the models.
    -   The app automatically tries `gemini-2.5-flash`, `gemini-2.0-flash`, and `gemini-1.5-flash` in order.
    -   Check if your Google Cloud project has billing enabled (if required for your region).

-   **"PDF is not a function"**:
    -   This error is obsolete as we have migrated away from `pdf-parse`. If you see it, delete your `.next` folder and restart the server.

---

## 📄 License

MIT
