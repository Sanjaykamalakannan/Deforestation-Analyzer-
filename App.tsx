import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MapView } from './components/MapView';
import { ApiKeyBanner } from './components/ApiKeyBanner';
import { AnalysisResponse, Coordinates, DateRange, Hotspot } from './types';
import { analyzeImage } from './services/geminiService';
import { generateRiskAssessment } from './services/geminiProService';
import { fetchGeeImage } from './services/geeService';
import { sampleForAnalysis1, sampleForAnalysis2 } from './services/sampleImageData';

// Default map center to the Amazon Rainforest
const INITIAL_CENTER: Coordinates = { lat: -3.4653, lng: -62.2159 };
const INITIAL_ZOOM = 5;

const App: React.FC = () => {
  const [isMapsApiLoaded, setIsMapsApiLoaded] = useState(false);
  const [showApiKeyBanner, setShowApiKeyBanner] = useState(false);
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const [mapCenter, setMapCenter] = useState<Coordinates>(INITIAL_CENTER);
  const [mapZoom, setMapZoom] = useState(INITIAL_ZOOM);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [mapBounds, setMapBounds] = useState<any>(null);

  useEffect(() => {
    // Check for Google Maps API script
    if (window.google && window.google.maps) {
        setIsMapsApiLoaded(true);
    } else {
        // Give it a moment to load, then show banner if it hasn't
        const timer = setTimeout(() => {
            if (!window.google || !window.google.maps) {
                setShowApiKeyBanner(true);
            } else {
                setIsMapsApiLoaded(true);
            }
        }, 1500);
        return () => clearTimeout(timer);
    }
  }, []);

  const resetState = useCallback(() => {
    setSelectedImage(null);
    setAnalysis(null);
    setError(null);
    setHotspots([]);
    setMapCenter(INITIAL_CENTER);
    setMapZoom(INITIAL_ZOOM);
    setIsLoading(false);
    setLoadingMessage('');
  }, []);
  
  const handleImageSelect = (file: File) => {
    resetState();
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSampleSelect = (sampleId: 'sample1' | 'sample2') => {
    resetState();
    const sampleData = sampleId === 'sample1' ? sampleForAnalysis1 : sampleForAnalysis2;
    setSelectedImage(`data:image/jpeg;base64,${sampleData}`);
  }

  const handleAnalyze = async () => {
    if (!selectedImage) {
      setError("No image selected to analyze.");
      return;
    }
    
    setError(null);
    setIsLoading(true);
    setLoadingMessage('Analyzing image for deforestation...');
    
    try {
      const [meta, base64Data] = selectedImage.split(',');
      const mimeType = meta.split(':')[1].split(';')[0];
      
      const initialResult = await analyzeImage(base64Data, mimeType);
      
      let finalResult = { ...initialResult, riskAssessment: '' };

      if (initialResult.isDeforestationDetected) {
        setLoadingMessage('Performing temporal analysis & risk assessment...');
        const riskText = await generateRiskAssessment(initialResult);
        finalResult.riskAssessment = riskText;
      }
      
      setAnalysis(finalResult);

      if (finalResult.isDeforestationDetected && finalResult.hotspots.length > 0) {
          setHotspots(finalResult.hotspots);
          // Focus map on the first hotspot
          handleFocusHotspot(finalResult.hotspots[0].center_coordinates);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleGeeRequest = async (dateRange: DateRange) => {
    resetState();
    setError(null);
    setIsLoading(true);
    setLoadingMessage('Fetching & pre-processing satellite imagery...');
    try {
        const image = await fetchGeeImage(dateRange, mapBounds);
        setSelectedImage(image);
    } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch GEE imagery.");
    } finally {
        setIsLoading(false);
        setLoadingMessage('');
    }
  };

  const handleFocusHotspot = (coords: Coordinates) => {
    setMapCenter(coords);
    setMapZoom(12);
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
      <Header />
      <main className="flex flex-1 overflow-hidden relative">
        {showApiKeyBanner && <ApiKeyBanner />}
        <Sidebar 
          selectedImage={selectedImage}
          analysis={analysis}
          isLoading={isLoading}
          loadingMessage={loadingMessage}
          error={error}
          onImageSelect={handleImageSelect}
          onSampleSelect={handleSampleSelect}
          onGeeRequest={handleGeeRequest}
          onAnalyze={handleAnalyze}
          onReset={resetState}
          onFocusHotspot={handleFocusHotspot}
        />
        <div className="flex-1 relative">
            {isMapsApiLoaded ? (
                <MapView 
                    center={mapCenter} 
                    zoom={mapZoom} 
                    mapId={process.env.REACT_APP_MAP_ID || ''}
                    hotspots={hotspots}
                    onIdle={(bounds) => setMapBounds(bounds)}
                />
            ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <p className="text-gray-400">Loading Map...</p>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}

export default App;