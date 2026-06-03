import React from 'react';
import { AnalysisResponse, Coordinates, DateRange } from '../types';
import { ImageUploader } from './ImageUploader';
import { GeeControlPanel } from './GeeControlPanel';
import { AnalysisResult } from './AnalysisResult';
import { SampleImages } from './SampleImages';
import { SpinnerIcon } from './icons';

interface SidebarProps {
  selectedImage: string | null;
  analysis: AnalysisResponse | null;
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
  onImageSelect: (file: File) => void;
  onSampleSelect: (sampleId: 'sample1' | 'sample2') => void;
  onGeeRequest: (dateRange: DateRange) => void;
  onAnalyze: () => void;
  onReset: () => void;
  onFocusHotspot: (coords: Coordinates) => void;
}

export const Sidebar: React.FC<SidebarProps> = (props) => {
  const { 
    selectedImage, analysis, isLoading, loadingMessage, error, 
    onImageSelect, onSampleSelect, onGeeRequest, onAnalyze, onReset, onFocusHotspot 
  } = props;

  const renderContent = () => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-8 space-y-4 h-full">
                <SpinnerIcon/>
                <p className="text-lg text-gray-300 animate-pulse">
                    {loadingMessage || 'Loading...'}
                </p>
                <p className="text-sm text-gray-500">This may take a moment.</p>
            </div>
        );
    }
    
    if (analysis) {
      return <AnalysisResult result={analysis} onFocusHotspot={onFocusHotspot} />;
    }

    if (selectedImage) {
      return (
        <div className="space-y-6">
          <div className="relative group">
            <img src={selectedImage} alt="Satellite view" className="rounded-xl w-full max-h-[40vh] object-cover" />
            <button 
              onClick={onReset}
              className="absolute top-3 right-3 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Remove image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="flex justify-center">
            <button
              onClick={onAnalyze}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-8 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <SpinnerIcon />
                  Analyzing...
                </>
              ) : 'Analyze for Deforestation'}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <GeeControlPanel onFetch={onGeeRequest} />
        <div className="relative my-6">
          <hr className="border-gray-600" />
          <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-gray-800 px-2 text-gray-400 text-sm">OR</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-200 mb-4">Upload Your Own Image</h2>
          <ImageUploader onImageSelect={onImageSelect} />
        </div>
         <div className="relative my-4">
          <hr className="border-gray-600" />
        </div>
        <SampleImages onSelect={onSampleSelect} isLoading={isLoading} />
      </div>
    );
  };

  return (
    <aside className="w-full md:w-[450px] lg:w-[500px] bg-gray-800 flex-shrink-0 p-6 overflow-y-auto shadow-2xl z-10">
      <div className="space-y-6">
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
            <p><strong>Error:</strong> {error}</p>
          </div>
        )}
        {renderContent()}
      </div>
    </aside>
  );
};
