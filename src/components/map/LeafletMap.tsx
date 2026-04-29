"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useStore, Hospital, BloodBank, Ambulance } from "../../data/store";

export default function LeafletMap() {
  const centerPosition: [number, number] = [19.0760, 72.8777]; // Base Mumbai Coordinate
  const { searchResults } = useStore();
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Reset default marker icons since React-Leaflet with Next.js breaks the image paths organically
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  // Update map bounds when searchResults changes
  useEffect(() => {
    if (mapRef.current && searchResults.length > 0) {
      const bounds = L.latLngBounds([centerPosition]);
      searchResults.forEach(item => {
        if (item.coords) bounds.extend(item.coords);
      });
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [searchResults]);

  return (
    <div className="w-full h-full bg-deepBlue z-0 relative">
      <MapContainer 
        center={centerPosition} 
        zoom={13} 
        scrollWheelZoom={true} 
        style={{ height: "100%", width: "100%", background: "#0B1C2C" }}
        className="z-0"
        ref={mapRef}
      >
        {/* Esri World Imagery map tile layer for high distinction Satellite view */}
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />

        {/* Pulse Circle around current location */}
        <Circle 
          center={centerPosition}
          radius={800} // Radius in meters (approx 0.5 miles)
          pathOptions={{ color: '#00E5FF', fillColor: '#00E5FF', fillOpacity: 0.1, weight: 1 }}
        />

        {/* Current Location */}
        <Marker position={centerPosition} zIndexOffset={100}>
          <Popup>
            <div className="font-sans text-deepBlue">
              <strong className="text-sm">Your Location</strong><br />
              <span className="text-xs text-gray-500">Mumbai, Maharashtra</span>
            </div>
          </Popup>
        </Marker>

        {/* Dynamic Markers Based on Real Data */}
        {searchResults.map((item) => {
          if (!item.coords) return null;

          return (
            <Marker key={item.id} position={item.coords as L.LatLngTuple}>
              <Popup>
                <div className="font-sans text-deepBlue py-1 pr-4 min-w-[200px]">
                  <strong className="text-sm block text-blue-600 mb-1">{item.name}</strong>
                  <div className="flex justify-between items-center bg-gray-50 p-1.5 rounded-md border border-gray-100 mb-2">
                    <span className="text-xs text-gray-600 font-semibold">{item.distance}</span>
                    <span className="text-[10px] text-gray-400">Updated: {item.last_updated}</span>
                  </div>
                  
                  {/* Hospital Info */}
                  {item.type === 'hospital' && (
                    <div className="flex justify-between items-center mt-1 border-t pt-2">
                      <span className="text-xs text-gray-600 font-medium">ICU Beds:</span>
                      <span className={`text-xs font-bold leading-none py-1 px-2 rounded ${
                        (item as Hospital).beds.icu.available > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {(item as Hospital).beds.icu.available} Available
                      </span>
                    </div>
                  )}

                  {/* Blood Bank Info */}
                  {item.type === 'bloodbank' && (
                    <div className="grid grid-cols-4 gap-1 mt-2 border-t pt-2">
                      {Object.entries((item as BloodBank).blood_inventory).map(([type, status]) => (
                        <div key={type} className="flex flex-col items-center bg-gray-50 rounded p-1">
                          <span className="text-[10px] text-gray-500 font-bold">{type}</span>
                          <span className={`w-2 h-2 rounded-full mt-1 ${
                            status === 'Critical' ? 'bg-red-500' : status === 'Low' ? 'bg-orange-500' : 'bg-green-500'
                          }`}></span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Ambulance Info */}
                  {item.type === 'ambulance' && (
                    <div className="flex justify-between items-center mt-1 border-t pt-2">
                      <span className="text-xs text-gray-600 font-medium">ETA: ${(item as Ambulance).eta}</span>
                      <span className={`text-[10px] font-bold uppercase ${
                        (item as Ambulance).available ? 'text-green-600' : 'text-red-500'
                      }`}>
                        {(item as Ambulance).available ? 'Available' : 'En Route'}
                      </span>
                    </div>
                  )}
                  <div className="flex gap-2 w-full mt-3">
                    <a href={`tel:${item.contact}`} className="flex-1 block text-center bg-blue-600 text-white text-[10px] font-bold uppercase py-1.5 rounded-md hover:bg-blue-700 transition">
                      Call
                    </a>
                    <a href={item.mapLink} target="_blank" rel="noopener noreferrer" className="flex-1 block text-center bg-cyan-600 text-white text-[10px] font-bold uppercase py-1.5 rounded-md hover:bg-cyan-700 transition">
                      Map
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
