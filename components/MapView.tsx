import React, { useEffect, useRef, useState } from 'react';
import { Coordinates, Hotspot } from '../types';

// Fix: Declare the `google` object to resolve TypeScript errors with the Google Maps API.
// The global `google` object is injected by the Maps script tag.
declare const google: any;

interface MapViewProps {
  center: Coordinates;
  zoom: number;
  mapId: string;
  hotspots: Hotspot[];
  // Fix: Use `google` for global Maps API types
  onIdle?: (bounds: google.maps.LatLngBounds | null) => void;
}

export const MapView: React.FC<MapViewProps> = ({ center, zoom, mapId, hotspots, onIdle }) => {
  const ref = useRef<HTMLDivElement>(null);
  // Fix: Use `google` for global Maps API types
  const [map, setMap] = useState<google.maps.Map | null>(null);
  // Fix: Use `google` for global Maps API types
  const [markers, setMarkers] = useState<google.maps.marker.AdvancedMarkerElement[]>([]);

  useEffect(() => {
    // Fix: Check `window.google` at runtime to ensure the Maps API script has loaded.
    if (ref.current && !map && window.google) {
      // Fix: Use the declared `google` for API access.
      const newMap = new google.maps.Map(ref.current, {
        center,
        zoom,
        mapId,
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
      });

      if (onIdle) {
          newMap.addListener('idle', () => {
              onIdle(newMap.getBounds() || null);
          });
      }
      setMap(newMap);
    }
  }, [ref, map, center, zoom, mapId, onIdle]);

  useEffect(() => {
    if (map) {
      // Check if camera update is needed to avoid feedback loops
      const currentCenter = map.getCenter();
      const currentZoom = map.getZoom();
      const isCenterDifferent = currentCenter && (Math.abs(currentCenter.lat() - center.lat) > 0.0001 || Math.abs(currentCenter.lng() - center.lng) > 0.0001);
      const isZoomDifferent = currentZoom !== zoom;

      if(isCenterDifferent || isZoomDifferent) {
          map.moveCamera({ center, zoom });
      }
    }
  }, [map, center, zoom]);

  useEffect(() => {
    // Fix: Check `window.google` at runtime to ensure the Maps API script has loaded.
    if (map && window.google) {
      // Clear existing markers
      markers.forEach(marker => marker.map = null);
      
      // Create new markers for hotspots
      const newMarkers = hotspots.map(hotspot => {
        // Fix: Use the declared `google` for API access.
        const marker = new google.maps.marker.AdvancedMarkerElement({
          map,
          position: hotspot.center_coordinates,
          title: hotspot.type,
        });

        // Fix: Use the declared `google` for API access.
        const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="color: #111; padding: 5px;">
                <h4 style="margin: 0 0 5px 0; font-weight: bold;">${hotspot.type}</h4>
                <p style="margin: 0;">Confidence: <strong>${hotspot.confidence}</strong></p>
                <p style="margin: 0;">Est. Area: ${hotspot.estimated_area_percentage}%</p>
              </div>
            `,
        });

        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });

        return marker;
      });

      setMarkers(newMarkers);
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, hotspots]);

  return <div ref={ref} className="w-full h-full" />;
};
