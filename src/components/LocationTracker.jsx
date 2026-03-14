import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, AlertTriangle, CheckCircle } from 'lucide-react';
import { patient } from '../data/patientData';
import 'leaflet/dist/leaflet.css';
import './LocationTracker.css';

// Create custom icon for patient avatar
const createPatientIcon = (photoUrl, isWandering) => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `
      <div class="lt-patient-marker ${isWandering ? 'marker-danger pulse' : ''}">
        <img src="${photoUrl}" class="lt-patient-avatar" />
        <div class="lt-marker-ring"></div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24]
  });
};

// Create custom icon for home
const homeIcon = L.divIcon({
  className: 'custom-leaflet-icon',
  html: `
    <div class="lt-home-marker">
      <div style="background: #e74c3c; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
        🏠
      </div>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 36]
});

// Coordinates for Green Park, New Delhi (simulated patient home)
const HOME_LOCATION = [28.5562, 77.2065];
// A point outside the 50m safe zone to simulate wandering
const WANDERING_LOCATION = [28.5570, 77.2065]; 
const SAFE_RADIUS_METERS = 50; 

// Helper component to center map when location changes
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { animate: true, duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

export default function LocationTracker() {
  const [currentLocation, setCurrentLocation] = useState(HOME_LOCATION);
  const [isWandering, setIsWandering] = useState(false);
  const [mapZoom, setMapZoom] = useState(19);

  const simulateWandering = () => {
    setIsWandering(true);
    setCurrentLocation(WANDERING_LOCATION);
    setMapZoom(18);
    
    // Speak an emergency alert
    const utterance = new SpeechSynthesisUtterance(`Emergency Alert: ${patient.name} has left the safe zone.`);
    utterance.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const simulateReturn = () => {
    setIsWandering(false);
    setCurrentLocation(HOME_LOCATION);
    setMapZoom(19);
  };

  return (
    <div className={`location-tracker-card ${isWandering ? 'warning-state' : ''}`}>
      <div className="lt-header">
        <div className="lt-title-area">
          <h3>
            <Navigation size={18} />
            Live GPS Tracking
          </h3>
          <span className={`lt-status-badge ${isWandering ? 'status-danger' : 'status-safe'}`}>
            <span className="lt-status-dot"></span>
            {isWandering ? 'WANDERING ALERT' : 'Safe at Home'}
          </span>
        </div>
        
        <div className="lt-controls">
          {!isWandering ? (
            <button className="lt-btn-simulate btn-danger" onClick={simulateWandering}>
              <AlertTriangle size={14} />
              Simulate Wandering
            </button>
          ) : (
            <button className="lt-btn-simulate btn-safe" onClick={simulateReturn}>
              <CheckCircle size={14} />
              Return Home
            </button>
          )}
        </div>
      </div>

      <div className="lt-map-container" style={{ height: '350px', width: '100%', borderRadius: '0', overflow: 'hidden' }}>
        <MapContainer 
          center={HOME_LOCATION} 
          zoom={19} 
          style={{ height: '100%', width: '100%', zIndex: 1 }}
          zoomControl={false}
        >
          <MapController center={currentLocation} zoom={mapZoom} />
          
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Safe Zone Circle */}
          <Circle 
            center={HOME_LOCATION} 
            radius={SAFE_RADIUS_METERS}
            pathOptions={{ 
              color: '#2ecc71',
              fillColor: '#2ecc71',
              fillOpacity: 0.15,
              weight: 2
            }}
          />

          {/* Home Marker */}
          <Marker position={HOME_LOCATION} icon={homeIcon} />

          {/* Patient Marker */}
          <Marker 
            position={currentLocation} 
            icon={createPatientIcon(patient.photo, isWandering)}
            zIndexOffset={1000}
          />
        </MapContainer>
      </div>

      <div className="lt-footer">
        <div className="lt-stats">
          <div className="lt-stat">
            <span className="lt-stat-label">Last Updated:</span>
            <strong>Just now</strong>
          </div>
          <div className="lt-stat">
            <span className="lt-stat-label">Battery:</span>
            <strong style={{color: '#2ecc71'}}>86%</strong>
          </div>
          <div className="lt-stat">
            <span className="lt-stat-label">Distance from Safe Zone:</span>
            <strong style={{color: isWandering ? '#e74c3c' : 'inherit'}}>
              {isWandering ? '89 meters' : '0 meters'}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
