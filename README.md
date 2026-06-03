# AI Deforestation Monitor 🌲📡

An AI-powered web application that analyzes satellite imagery for signs of deforestation, identifies potential environmental hotspots, and performs temporal/risk assessments using the **Gemini API** and **Google Maps Platform**.

This platform allows researchers, environmentalists, and local authorities to upload satellite images or fetch Earth Engine data to detect forest disturbances, highlight at-risk zones, and make informed conservation decisions.

---

## 🚀 Key Features

*   **Deforestation Detection**: Rapid visual analysis of satellite/canopy imagery to identify areas of logging, agricultural expansion, or wildfire damage.
*   **Gemini-Powered Risk Assessments**: Leverages Google Gen AI to generate detailed narrative reports, assessing future risks, driving factors, and recovery pathways for detected clearings.
*   **Dynamic Interactive Map**: Automatically centers and visualizes flagged hotspots on Google Maps with custom spatial overlays and bounds monitoring.
*   **Earth Engine Simulation**: Integrated controls to capture and pre-process historical/temporal images from earth observation systems.
*   **No-Cloud Client-Side Processing**: Safe, responsive image handling and high-contrast night/satellite visualization mode.

---

## 🛠️ Technology Stack

*   **Frontend**: React (v19) & TypeScript (v5.8)
*   **Build Tool**: Vite (v6) with path aliasing
*   **Styling**: Tailwind CSS (v4)
*   **AI Engine**: `@google/genai` (v1.29) utilizing advanced multimodal Gemini reasoning
*   **Interactive Controls**: Google Maps JS SDK (Vector maps with Advanced Markers)

---

## 🏃 Getting Started

### Prerequisites

*   Node.js (v18 or higher)
*   An API Key from Google AI Studio ([Get a Gemini Key](https://aistudio.google.com/))
*   A Google Maps Javascript API Key ([Get a Google Maps Key](https://console.cloud.google.com/))

### Installation

1. **Clone this repository**:
   ```bash
   git clone https://github.com/your-username/ai-deforestation-monitor.git
   cd ai-deforestation-monitor
Install dependencies:
code
Bash
npm install
Configure environment variables:
Create a .env file in the root directory and add your secret credentials:
code
Env
GEMINI_API_KEY=your_gemini_api_key_here
Start the development server:
code
Bash
npm run dev
Open your browser and navigate to http://localhost:3000.
📂 Project Structure
code
Code
├── components/          # React layout and UI components
│   ├── MapView.tsx      # Interactive Google Map visualizer
│   ├── Sidebar.tsx      # Controls, image selection & status indicators
│   └── ...              # Sub-components (Uploader, Analyzers, Banners)
├── services/            # API, AI models, and GEE integrations
│   ├── geminiService.ts     # Primary deforestation detector
│   ├── geminiProService.ts  # Deep analysis and risk assessment proxy
│   └── ...                  # Earth Engine & Location adapters
├── types.ts             # Strong interfaces for hotspot data and states
├── App.tsx              # Main orchestrator component
└── vite.config.ts       # Path aliasing & environment definitions
