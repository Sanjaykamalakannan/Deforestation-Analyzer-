import React from 'react';
import { KeyIcon, WarningIcon } from './icons';

export const ApiKeyBanner: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center p-4 z-20 animate-fade-in">
      <div className="max-w-2xl w-full bg-red-900/50 border-2 border-red-700 rounded-xl p-8 text-center shadow-2xl">
        <div className="flex justify-center items-center gap-4 mb-4">
            <WarningIcon />
            <h2 className="text-2xl font-bold text-red-300">Google Maps Configuration Error</h2>
        </div>
        <p className="text-gray-300 mb-2">
          The map could not be loaded because the Google Maps API key is missing or invalid.
        </p>
        <p className="text-gray-300 mb-6">
          To fix this, open the <code className="bg-gray-700 text-emerald-300 px-2 py-1 rounded-md text-sm">index.html</code> file and replace the placeholder <code className="bg-gray-700 text-emerald-300 px-2 py-1 rounded-md text-sm">'YOUR_API_KEY'</code> with your actual Google Maps API key.
        </p>
        <a 
          href="https://console.cloud.google.com/google/maps-apis/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors"
        >
          <KeyIcon />
          Get an API Key
        </a>
      </div>
    </div>
  );
};

// Simple fade-in animation
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
  }
`;
document.head.appendChild(style);
