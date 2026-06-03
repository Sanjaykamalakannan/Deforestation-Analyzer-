import React from 'react';
import { sampleForAnalysis1_thumb, sampleForAnalysis2_thumb } from '../services/sampleImageData';

interface SampleImagesProps {
  onSelect: (sampleId: 'sample1' | 'sample2') => void;
  isLoading: boolean;
}

export const SampleImages: React.FC<SampleImagesProps> = ({ onSelect, isLoading }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-300 mb-3 text-center">Or try a sample image:</h3>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onSelect('sample1')}
          disabled={isLoading}
          className="relative rounded-lg overflow-hidden group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Select sample image 1"
        >
          <img src={`data:image/jpeg;base64,${sampleForAnalysis1_thumb}`} alt="Sample 1" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
          <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
            <span className="text-white font-bold text-sm">Sample 1</span>
          </div>
        </button>
        <button
          onClick={() => onSelect('sample2')}
          disabled={isLoading}
          className="relative rounded-lg overflow-hidden group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Select sample image 2"
        >
          <img src={`data:image/jpeg;base64,${sampleForAnalysis2_thumb}`} alt="Sample 2" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
          <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
            <span className="text-white font-bold text-sm">Sample 2</span>
          </div>
        </button>
      </div>
    </div>
  );
};
