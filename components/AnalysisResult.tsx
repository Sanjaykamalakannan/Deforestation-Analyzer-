import React from 'react';
import { AnalysisResponse, Hotspot, Coordinates } from '../types';
import { CheckCircleIcon, WarningIcon, MapPinIcon, FireIcon, AreaIcon, FocusIcon, TrendingUpIcon } from './icons';

interface AnalysisResultProps {
  result: AnalysisResponse;
  onFocusHotspot: (coords: Coordinates) => void;
}

const getConfidenceColor = (confidence: string) => {
  switch (confidence?.toLowerCase()) {
    case 'high':
      return 'bg-red-500 border-red-400';
    case 'medium':
      return 'bg-yellow-500 border-yellow-400';
    case 'low':
      return 'bg-blue-500 border-blue-400';
    default:
      return 'bg-gray-500 border-gray-400';
  }
};

const HotspotCard: React.FC<{ hotspot: Hotspot, onFocus: () => void }> = ({ hotspot, onFocus }) => (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 transition-all duration-300 hover:border-emerald-500/80">
        <div className="flex items-start justify-between mb-3">
            <h4 className="font-bold text-lg text-emerald-300 flex items-center gap-2 pr-2"><MapPinIcon/> {hotspot.location_description}</h4>
            <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full text-white border whitespace-nowrap ${getConfidenceColor(hotspot.confidence)}`}>
                {hotspot.confidence}
            </span>
        </div>
        <div className="space-y-2 text-gray-300 mb-4">
           <p className="flex items-center gap-2 text-sm"><FireIcon/> <strong>Type:</strong> {hotspot.type}</p>
           <p className="flex items-center gap-2 text-sm"><AreaIcon/> <strong>Est. Area:</strong> {hotspot.estimated_area_percentage}% of image</p>
        </div>
        <button 
          onClick={onFocus}
          className="w-full flex items-center justify-center gap-2 text-sm px-4 py-2 bg-emerald-800/50 text-emerald-300 font-semibold rounded-md hover:bg-emerald-700/70 transition-colors"
        >
          <FocusIcon />
          Focus on Map
        </button>
    </div>
);


export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, onFocusHotspot }) => {
  return (
    <div className="animate-fade-in space-y-6">
      <h2 className="text-2xl font-bold text-center text-emerald-400 border-b border-gray-600 pb-3">Analysis Report</h2>
      
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="font-semibold text-lg mb-2 text-gray-200">Summary</h3>
        <p className="text-gray-300">{result.summary}</p>
      </div>

      <div className={`p-4 rounded-lg flex items-center gap-3 ${result.isDeforestationDetected ? 'bg-red-900/50 border border-red-700' : 'bg-green-900/50 border border-green-700'}`}>
        {result.isDeforestationDetected ? <WarningIcon /> : <CheckCircleIcon />}
        <span className={`font-bold ${result.isDeforestationDetected ? 'text-red-300' : 'text-green-300'}`}>
          {result.isDeforestationDetected ? 'Potential Deforestation Detected' : 'No Significant Deforestation Detected'}
        </span>
      </div>

      {result.isDeforestationDetected && result.riskAssessment && (
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="font-semibold text-lg mb-2 text-gray-200 flex items-center gap-2"><TrendingUpIcon /> Temporal Analysis &amp; Future Risk</h3>
            <p className="text-gray-300 text-sm whitespace-pre-wrap">{result.riskAssessment}</p>
        </div>
      )}

      {result.isDeforestationDetected && result.hotspots.length > 0 && (
         <div>
            <h3 className="font-semibold text-lg mb-3 text-gray-200">Identified Hotspots</h3>
            <div className="grid grid-cols-1 gap-4">
                {result.hotspots.map((hotspot, index) => (
                    <HotspotCard key={index} hotspot={hotspot} onFocus={() => onFocusHotspot(hotspot.center_coordinates)} />
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

// Simple fade-in animation
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);