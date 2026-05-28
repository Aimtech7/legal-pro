// Office Locations Map Component for LegalPro v1.0.1
import React, { useState } from 'react';
import { MapPin, Phone, Clock, Navigation, Car, Bus } from 'lucide-react';
import GoogleMapWrapper, { MarkerData } from './GoogleMapWrapper';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface Office {
  id: number;
  name: string;
  address: string;
  street: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  coordinates: { lat: number; lng: number };
  parking: string;
  publicTransport: string;
  landmarks: string;
  services: string[];
}

interface OfficeLocationsMapProps {
  offices: Office[];
  selectedOfficeId?: number;
  onOfficeSelect?: (office: Office) => void;
  height?: string;
  showOfficeList?: boolean;
}

const OfficeLocationsMap: React.FC<OfficeLocationsMapProps> = ({
  offices,
  selectedOfficeId,
  onOfficeSelect,
  height = '500px',
  showOfficeList = true
}) => {
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(
    selectedOfficeId ? offices.find(office => office.id === selectedOfficeId) || null : null
  );

  // Convert offices to markers
  const markers: MarkerData[] = offices.map(office => ({
    id: office.id.toString(),
    position: office.coordinates,
    title: office.name,
    address: `${office.address}, ${office.street}, ${office.city}`,
    phone: office.phone,
    hours: `${office.hours.weekdays}\n${office.hours.saturday}\n${office.hours.sunday}`,
    services: office.services
  }));

  // Calculate center point for map
  const center = offices.length > 0 ? {
    lat: offices.reduce((sum, office) => sum + office.coordinates.lat, 0) / offices.length,
    lng: offices.reduce((sum, office) => sum + office.coordinates.lng, 0) / offices.length
  } : { lat: -1.2921, lng: 36.8219 };

  const handleMarkerClick = (marker: MarkerData) => {
    const office = offices.find(o => o.id.toString() === marker.id);
    if (office) {
      setSelectedOffice(office);
      if (onOfficeSelect) {
        onOfficeSelect(office);
      }
    }
  };

  const handleOfficeClick = (office: Office) => {
    setSelectedOffice(office);
    if (onOfficeSelect) {
      onOfficeSelect(office);
    }
  };

  return (
    <div className="space-y-6">
      {/* Map */}
      <div className="relative">
        <GoogleMapWrapper
          center={center}
          zoom={offices.length === 1 ? 15 : 10}
          markers={markers}
          height={height}
          onMarkerClick={handleMarkerClick}
          className="rounded-lg overflow-hidden shadow-md"
        />
        
        {/* Map Controls */}
        <div className="absolute top-4 right-4 space-y-2">
          <Button
            size="sm"
            variant="outline"
            className="bg-white shadow-md"
            onClick={() => {
              const url = `https://www.google.com/maps/search/?api=1&query=${markers.map(m => `${m.position.lat},${m.position.lng}`).join('|')}`;
              window.open(url, '_blank');
            }}
          >
            <Navigation className="w-4 h-4 mr-2" />
            View in Google Maps
          </Button>
        </div>
      </div>

      {/* Office List */}
      {showOfficeList && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {offices.map((office) => (
            <Card
              key={office.id}
              className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                selectedOffice?.id === office.id ? 'ring-2 ring-navy-500 bg-navy-50' : ''
              }`}
              onClick={() => handleOfficeClick(office)}
            >
              <div className="flex items-start space-x-3 mb-4">
                <MapPin className="w-6 h-6 text-navy-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-navy-800 mb-1">
                    {office.name}
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{office.address}</p>
                    <p>{office.street}</p>
                    <p>{office.city}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{office.phone}</span>
                </div>

                <div className="flex items-start space-x-2">
                  <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div className="text-gray-600">
                    <p>{office.hours.weekdays}</p>
                    <p>{office.hours.saturday}</p>
                    <p className="text-red-600">{office.hours.sunday}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Car className="w-4 h-4 text-gray-400 mt-0.5" />
                  <span className="text-gray-600">{office.parking}</span>
                </div>

                <div className="flex items-start space-x-2">
                  <Bus className="w-4 h-4 text-gray-400 mt-0.5" />
                  <span className="text-gray-600">{office.publicTransport}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${office.coordinates.lat},${office.coordinates.lng}`,
                        '_blank'
                      );
                    }}
                  >
                    <Navigation className="w-3 h-3 mr-1" />
                    Directions
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`tel:${office.phone}`);
                    }}
                  >
                    <Phone className="w-3 h-3 mr-1" />
                    Call
                  </Button>
                </div>
              </div>

              {/* Services */}
              <div className="mt-4">
                <h4 className="text-xs font-medium text-gray-700 mb-2">Services Available:</h4>
                <div className="flex flex-wrap gap-1">
                  {office.services.slice(0, 3).map((service, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 text-xs bg-navy-100 text-navy-800 rounded"
                    >
                      {service}
                    </span>
                  ))}
                  {office.services.length > 3 && (
                    <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                      +{office.services.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Selected Office Details */}
      {selectedOffice && (
        <Card className="p-6 bg-navy-50 border-navy-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-navy-800 mb-2">
                {selectedOffice.name}
              </h3>
              <p className="text-navy-600">Selected Office</p>
            </div>
            <Button
              size="sm"
              onClick={() => setSelectedOffice(null)}
              variant="outline"
            >
              ✕
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-navy-800 mb-2">Contact Information</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Address:</strong> {selectedOffice.address}, {selectedOffice.street}</p>
                <p><strong>City:</strong> {selectedOffice.city}</p>
                <p><strong>Postal:</strong> {selectedOffice.postalCode}</p>
                <p><strong>Phone:</strong> {selectedOffice.phone}</p>
                <p><strong>Email:</strong> {selectedOffice.email}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-navy-800 mb-2">Getting There</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Landmarks:</strong> {selectedOffice.landmarks}</p>
                <p><strong>Parking:</strong> {selectedOffice.parking}</p>
                <p><strong>Public Transport:</strong> {selectedOffice.publicTransport}</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold text-navy-800 mb-2">Available Services</h4>
            <div className="flex flex-wrap gap-2">
              {selectedOffice.services.map((service, index) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 text-sm bg-navy-100 text-navy-800 rounded-full"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default OfficeLocationsMap;
export type { Office };
