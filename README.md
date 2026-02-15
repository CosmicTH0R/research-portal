# Research Portal - Financial Statement Extractor

A minimal research portal that extracts structured financial data from unstructured documents (PDF/Text) using AI.

## Features

-   **Document Ingestion**: Upload PDF Annual Reports or financial text files.
-   **AI Extraction**: Uses Google Gemini 1.5 Flash (Multimodal) to identify and extract income statement line items directly from PDFs.
-   **Structured Output**: Downloads extracted data as formatted Excel (.xlsx) files.
-   **Clean UI**: Simple, analyst-focused interface.

## Setup

1.  **Clone/Download** the repository.
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run the development server**:
    ```bash
    npm run dev
    ```
4.  **Open** [http://localhost:3000](http://localhost:3000).

## Usage

1.  Enter your **Gemini API Key** in the input field (keys are not stored, only used for the session).
2.  **Upload** a financial document (e.g., Annual Report PDF).
3.  Click **Extract Financial Data**.
4.  Review the extracted table and click **Download Excel** to save the analysis.

## Tech Stack

-   **Frontend**: Next.js 14, React, Tailwind CSS
-   **Backend**: Next.js API Routes
-   **AI**: Google Gemini API (@google/generative-ai)
-   **Processing**: Multimodal PDF processing (Gemini), `xlsx` (Excel generation)

## Deployment

This project is ready for deployment on Vercel.
1.  Push to GitHub.
2.  Import project in Vercel.
3.  (Optional) Set `OPENAI_API_KEY` env var if you want to provide a default key, otherwise users must enter their own.
