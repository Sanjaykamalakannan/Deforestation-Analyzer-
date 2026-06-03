// FIX: Declare the global `google` object to resolve TypeScript errors with the Google Maps API.
// This is necessary because the Maps API is loaded via a script tag and its types are not known to TypeScript by default.
declare global {
  interface Window {
    google: any;
  }
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Hotspot {
  location_description: string;
  type: string;
  confidence: 'High' | 'Medium' | 'Low' | string;
  estimated_area_percentage: number;
  center_coordinates: Coordinates;
}

export interface AnalysisResponse {
  summary: string;
  isDeforestationDetected: boolean;
  hotspots: Hotspot[];
  riskAssessment?: string;
}

export interface DateRange {
    start: string;
    end: string;
}