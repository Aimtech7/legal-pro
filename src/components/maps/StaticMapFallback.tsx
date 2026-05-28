// Static Map Fallback Component for LegalPro v1.0.1
import React from 'react';
import { MapPin, Navigation, Phone, ExternalLink } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface StaticMapLocation {
  id: string;
  title: string;
  address: string;
  phone?: string;
  coordinates: { lat: number; lng: number };
  services?: string[];
}

interface StaticMapFallbackProps {
  locations: StaticMapLocation[];
  height?: string;
  className?: string;
}

const StaticMapFallback: React.FC<StaticMapFallbackProps> = ({
  locations,
  height = '400px',
  className = ''
}) => {
  const generateStaticMapUrl = () => {
    const baseUrl = 'https://maps.googleapis.com/maps/api/staticmap';
    const size = '800x400';
    const zoom = locations.length === 1 ? '15' : '10';
    
    // Create markers for all locations
    const markers = locations.map(location => 
      `markers=color:blue%7Clabel:${location.title.charAt(0)}%7C${location.coordinates.lat},${location.coordinates.lng}`
    ).join('&');
    
    // Calculate center point
    const centerLat = locations.reduce((sum, loc) => sum + loc.coordinates.lat, 0) / locations.length;
    const centerLng = locations.reduce((sum, loc) => sum + loc.coordinates.lng, 0) / locations.length;
    
    return `${baseUrl}?center=${centerLat},${centerLng}&zoom=${zoom}&size=${size}&${markers}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
  };

  return (
    <div className={className}>
      <Card className="overflow-hidden">
        {/* Static Map Image */}
        <div style={{ height }} className="relative bg-gray-100">
          {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? (
            <img
              src={generateStaticMapUrl()}
              alt="Office Locations Map"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to a simple placeholder if static map fails
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          
          {/* Fallback placeholder */}
          <div className={`absolute inset-0 flex items-center justify-center bg-gray-200 ${import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 'hidden' : ''}`}>
            <div className="text-center p-6">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Map View Unavailable
              </h3>
              <p className="text-gray-500 text-sm">
                Interactive map requires Google Maps API configuration
              </p>
            </div>
          </div>
          
          {/* View in Google Maps Button */}
          <div className="absolute top-4 right-4">
            <Button
              size="sm"
              onClick={() => {
                const query = locations.map(loc => `${loc.coordinates.lat},${loc.coordinates.lng}`).join('|');
                window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
              }}
              className="bg-white text-gray-800 hover:bg-gray-50 shadow-md"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View in Google Maps
            </Button>
          </div>
        </div>
        
        {/* Location Details */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-navy-800 mb-4">
            Office Locations ({locations.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map((location) => (
              <div key={location.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-3 mb-3">
                  <MapPin className="w-5 h-5 text-navy-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-navy-800 mb-1">
                      {location.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {location.address}
                    </p>
                  </div>
                </div>
                
                {location.phone && (
                  <div className="flex items-center space-x-2 mb-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <a 
                      href={`tel:${location.phone}`}
                      className="text-sm text-navy-600 hover:underline"
                    >
                      {location.phone}
                    </a>
                  </div>
                )}
                
                {location.services && location.services.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-gray-700 mb-1">Services:</p>
                    <div className="flex flex-wrap gap-1">
                      {location.services.slice(0, 2).map((service, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 text-xs bg-navy-100 text-navy-800 rounded"
                        >
                          {service}
                        </span>
                      ))}
                      {location.services.length > 2 && (
                        <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          +{location.services.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(
                      `https://www.google.com/maps/dir/?api=1&destination=${location.coordinates.lat},${location.coordinates.lng}`,
                      '_blank'
                    )}
                    className="flex-1"
                  >
                    <Navigation className="w-3 h-3 mr-1" />
                    Directions
                  </Button>
                  {location.phone && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`tel:${location.phone}`)}
                    >
                      <Phone className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StaticMapFallback;
export type { StaticMapLocation };
