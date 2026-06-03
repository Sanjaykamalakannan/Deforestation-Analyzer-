import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { AnalysisResponse } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A brief, one to two sentence summary of the deforestation analysis.",
    },
    isDeforestationDetected: {
        type: Type.BOOLEAN,
        description: "A boolean indicating if any signs of deforestation were detected."
    },
    hotspots: {
      type: Type.ARRAY,
      description: "A list of identified deforestation hotspots. This should be empty if no deforestation is detected.",
      items: {
        type: Type.OBJECT,
        properties: {
          location_description: {
            type: Type.STRING,
            description: "A textual description of the hotspot's location within the image (e.g., 'top-left quadrant', 'center, near the river').",
          },
          type: {
            type: Type.STRING,
            description: "The type of deforestation observed (e.g., 'Clear-cutting', 'Selective logging', 'Forest fire scarring', 'Infrastructure development').",
          },
          confidence: {
            type: Type.STRING,
            description: "An estimation of the confidence in this finding (e.g., 'High', 'Medium', 'Low').",
          },
          estimated_area_percentage: {
            type: Type.NUMBER,
            description: "A rough numerical estimate of the percentage of the total image area affected by this hotspot."
          },
          center_coordinates: {
            type: Type.OBJECT,
            description: "The estimated central coordinates of the hotspot as latitude and longitude.",
            properties: {
                lat: {
                    type: Type.NUMBER,
                    description: "Latitude, ranging from -90 to 90."
                },
                lng: {
                    type: Type.NUMBER,
                    description: "Longitude, ranging from -180 to 180."
                }
            },
            required: ["lat", "lng"]
          }
        },
        required: ["location_description", "type", "confidence", "estimated_area_percentage", "center_coordinates"]
      },
    },
  },
  required: ["summary", "isDeforestationDetected", "hotspots"],
};

export async function analyzeImage(base64ImageData: string, mimeType: string): Promise<AnalysisResponse> {
  const model = 'gemini-2.5-flash';

  const prompt = `You are an expert in environmental science and satellite imagery analysis. Your task is to analyze the provided satellite image for any signs of deforestation. 
  
  Carefully examine the image for patterns like clear-cutting, forest fragmentation, new roads or infrastructure in forested areas, burn scars, or significant changes in vegetation cover that indicate forest loss.
  For each detected hotspot, you MUST provide an estimated central coordinate (latitude and longitude). The coordinates should be a plausible estimate based on visual cues if the image is not geotagged.
  
  Provide your analysis in the specified JSON format. If no clear evidence of deforestation is found, the 'hotspots' array should be empty and 'isDeforestationDetected' should be false.`;

  try {
    // FIX: The `contents` field for a single-turn, multi-part request should be an object, not an array.
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        contents: {
            parts: [
                { text: prompt },
                {
                    inlineData: {
                        data: base64ImageData,
                        mimeType: mimeType,
                    },
                },
            ]
        },
        config: {
            responseMimeType: 'application/json',
            responseSchema: analysisSchema,
        },
    });

    const jsonText = response.text;
    if (!jsonText) {
        throw new Error("Received an empty response from the AI model.");
    }
    const parsedResponse = JSON.parse(jsonText);
    
    return parsedResponse as AnalysisResponse;

  } catch (error) {
    console.error("Error analyzing image with Gemini API:", error);
    if (error instanceof Error && error.message.includes('SAFETY')) {
        throw new Error("The image could not be processed due to safety settings. Please try a different image.");
    }
    throw new Error("Failed to get a valid analysis from the AI model.");
  }
}
