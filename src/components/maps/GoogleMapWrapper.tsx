// Google Maps Wrapper Component for LegalPro v1.0.1
import React, { useEffect, useRef, useState } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { MapPin, Navigation, Phone, Clock, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface MapProps {
  center: google.maps.LatLngLiteral;
  zoom: number;
  markers?: MarkerData[];
  height?: string;
  onMarkerClick?: (marker: MarkerData) => void;
}

interface MarkerData {
  id: string;
  position: google.maps.LatLngLiteral;
  title: string;
  address: string;
  phone?: string;
  hours?: string;
  services?: string[];
}

const Map: React.FC<MapProps> = ({ center, zoom, markers = [], height = '400px', onMarkerClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow>();

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });
      setMap(newMap);

      const newInfoWindow = new window.google.maps.InfoWindow();
      setInfoWindow(newInfoWindow);
    }
  }, [ref, map, center, zoom]);

  useEffect(() => {
    if (map && markers.length > 0) {
      // Clear existing markers
      markers.forEach((markerData) => {
        const marker = new window.google.maps.Marker({
          position: markerData.position,
          map,
          title: markerData.title,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="#1e3a8a" stroke="#ffffff" stroke-width="2"/>
                <circle cx="12" cy="10" r="3" fill="#ffffff"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 32),
            anchor: new window.google.maps.Point(16, 32)
          }
        });

        const contentString = `
          <div style="max-width: 300px; padding: 12px;">
            <h3 style="margin: 0 0 8px 0; color: #1e3a8a; font-size: 16px; font-weight: bold;">
              ${markerData.title}
            </h3>
            <div style="margin-bottom: 8px; color: #4b5563; font-size: 14px;">
              <strong>📍 Address:</strong><br>
              ${markerData.address}
            </div>
            ${markerData.phone ? `
              <div style="margin-bottom: 8px; color: #4b5563; font-size: 14px;">
                <strong>📞 Phone:</strong> ${markerData.phone}
              </div>
            ` : ''}
            ${markerData.hours ? `
              <div style="margin-bottom: 8px; color: #4b5563; font-size: 14px;">
                <strong>🕒 Hours:</strong><br>
                ${markerData.hours}
              </div>
            ` : ''}
            ${markerData.services && markerData.services.length > 0 ? `
              <div style="margin-bottom: 12px; color: #4b5563; font-size: 14px;">
                <strong>⚖️ Services:</strong><br>
                ${markerData.services.join(', ')}
              </div>
            ` : ''}
            <div style="display: flex; gap: 8px; margin-top: 12px;">
              <a href="https://www.google.com/maps/dir/?api=1&destination=${markerData.position.lat},${markerData.position.lng}" 
                 target="_blank" 
                 style="background: #1e3a8a; color: white; padding: 6px 12px; border-radius: 4px; text-decoration: none; font-size: 12px;">
                🧭 Directions
              </a>
              ${markerData.phone ? `
                <a href="tel:${markerData.phone}" 
                   style="background: #059669; color: white; padding: 6px 12px; border-radius: 4px; text-decoration: none; font-size: 12px;">
                  📞 Call
                </a>
              ` : ''}
            </div>
          </div>
        `;

        marker.addListener('click', () => {
          if (infoWindow) {
            infoWindow.setContent(contentString);
            infoWindow.open(map, marker);
          }
          if (onMarkerClick) {
            onMarkerClick(markerData);
          }
        });
      });

      // Fit map to show all markers
      if (markers.length > 1) {
        const bounds = new window.google.maps.LatLngBounds();
        markers.forEach(marker => bounds.extend(marker.position));
        map.fitBounds(bounds);
      }
    }
  }, [map, markers, infoWindow, onMarkerClick]);

  return <div ref={ref} style={{ height, width: '100%', borderRadius: '8px' }} />;
};

const LoadingComponent: React.FC = () => (
  <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-800 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading Google Maps...</p>
    </div>
  </div>
);

const ErrorComponent: React.FC<{ status: Status; markers?: MarkerData[] }> = ({ status, markers = [] }) => (
  <div className="flex items-center justify-center h-96 bg-red-50 rounded-lg border border-red-200">
    <div className="text-center p-6 max-w-md">
      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-red-800 mb-2">Map Loading Error</h3>
      <p className="text-red-600 mb-4">
        {status === Status.FAILURE ? 'Failed to load Google Maps' : `Error: ${status}`}
      </p>
      <p className="text-sm text-red-500 mb-4">
        This might be due to API key restrictions or network issues.
      </p>

      {/* Fallback: Show locations as a list */}
      {markers.length > 0 && (
        <div className="mt-6 p-4 bg-white rounded-lg border">
          <h4 className="font-semibold text-gray-800 mb-3">Office Locations:</h4>
          <div className="space-y-2 text-left">
            {markers.map((marker) => (
              <div key={marker.id} className="text-sm">
                <p className="font-medium text-gray-800">{marker.title}</p>
                <p className="text-gray-600">{marker.address}</p>
                {marker.phone && (
                  <a href={`tel:${marker.phone}`} className="text-navy-600 hover:underline">
                    {marker.phone}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 space-y-2">
        <Button
          size="sm"
          onClick={() => window.location.reload()}
          className="mr-2"
        >
          Retry Loading Map
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => window.open('https://developers.google.com/maps/documentation/javascript/get-api-key', '_blank')}
        >
          Get API Key
        </Button>
      </div>
    </div>
  </div>
);

const render = (status: Status, markers?: MarkerData[]) => {
  switch (status) {
    case Status.LOADING:
      return <LoadingComponent />;
    case Status.FAILURE:
      return <ErrorComponent status={status} markers={markers} />;
    case Status.SUCCESS:
      return <Map center={{ lat: -1.2921, lng: 36.8219 }} zoom={10} />;
    default:
      return <LoadingComponent />;
  }
};

interface GoogleMapWrapperProps {
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  markers?: MarkerData[];
  height?: string;
  onMarkerClick?: (marker: MarkerData) => void;
  className?: string;
}

const GoogleMapWrapper: React.FC<GoogleMapWrapperProps> = ({
  center = { lat: -1.2921, lng: 36.8219 }, // Default to Nairobi
  zoom = 10,
  markers = [],
  height = '400px',
  onMarkerClick,
  className = ''
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-amber-800 mb-2">Google Maps API Key Required</h3>
          <p className="text-amber-600 mb-4">
            Please configure the Google Maps API key to enable map functionality.
          </p>
          <Button
            variant="outline"
            onClick={() => window.open('https://developers.google.com/maps/documentation/javascript/get-api-key', '_blank')}
          >
            Get API Key
          </Button>
        </div>
      </Card>
    );
  }

  const renderWithMarkers = (status: Status) => render(status, markers);

  return (
    <div className={className}>
      <Wrapper apiKey={apiKey} render={renderWithMarkers}>
        <Map
          center={center}
          zoom={zoom}
          markers={markers}
          height={height}
          onMarkerClick={onMarkerClick}
        />
      </Wrapper>
    </div>
  );
};

export default GoogleMapWrapper;
export type { MarkerData };
