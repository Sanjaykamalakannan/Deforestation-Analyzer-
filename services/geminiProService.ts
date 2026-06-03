import { GoogleGenAI } from "@google/genai";
import { AnalysisResponse } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateRiskAssessment(analysis: AnalysisResponse): Promise<string> {
  const model = 'gemini-2.5-pro'; // Use the more powerful model for this complex task.

  const prompt = `
    An initial analysis of a satellite image has detected signs of deforestation. 
    Here is the summary of the findings:
    ---
    Initial Summary: ${analysis.summary}
    Detected Hotspots: ${analysis.hotspots.map(h => `- ${h.type} (${h.confidence} confidence) in ${h.location_description}`).join('\n')}
    ---

    Based on this information, please provide a "Temporal Analysis & Future Risk Assessment". 
    Your response should be a concise paragraph (3-5 sentences) and consider the following:
    1.  **Temporal Patterns:** Based on the *types* of deforestation (e.g., 'Clear-cutting' vs. 'Infrastructure development'), what can be inferred about the timeline? Is this likely recent, rapid change or a slow encroachment?
    2.  **Future Risk:** What are the potential future risks to the surrounding forest area? Mention the likelihood of expansion, potential for soil erosion, or impact on biodiversity.
    3.  **Confidence:** Frame your assessment with appropriate uncertainty. Use phrases like "suggests," "could indicate," or "poses a risk of."

    Your response should be formatted as a single block of text, suitable for direct display.
  `;

  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt
    });

    const text = response.text;
    if (!text) {
        throw new Error("Received an empty risk assessment from the AI model.");
    }
    
    return text.trim();

  } catch (error) {
    console.error("Error generating risk assessment with Gemini Pro:", error);
    if (error instanceof Error && error.message.includes('SAFETY')) {
        throw new Error("The analysis could not be processed further due to safety settings.");
    }
    throw new Error("Failed to generate a risk assessment from the AI model.");
  }
}