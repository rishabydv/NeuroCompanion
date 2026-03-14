import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, OverlayView } from '@react-google-maps/api';
import { MapPin, Navigation, AlertTriangle, CheckCircle } from 'lucide-react';
import { patient } from '../data/patientData';
import './LocationTracker.css';

// Coordinates for Green Park, New Delhi (simulated patient home)
const HOME_LOCATION = { lat: 28.5562, lng: 77.2065 };
// A point outside the 50m safe zone to simulate wandering
const WANDERING_LOCATION = { lat: 28.5570, lng: 77.2065 }; 
const SAFE_RADIUS_METERS = 50; // 50 meters

const containerStyle = {
  width: '100%',
  height: '350px',
  borderRadius: '16px'
};

// We fallback to a dummy key if none provided to ensure the component doesn't crash, 
// though Google Maps will show "For development purposes only".
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

export default function LocationTracker() {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });

  const [map, setMap] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(HOME_LOCATION);
  const [isWandering, setIsWandering] = useState(false);
  const safeZoneRef = useRef(null);

  const onLoad = useCallback(function callback(mapInstance) {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  // Draw the safe zone circle on load/update
  useEffect(() => {
    if (isLoaded && map) {
      if (!safeZoneRef.current) {
        safeZoneRef.current = new window.google.maps.Circle({
          strokeColor: '#2ecc71',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#2ecc71',
          fillOpacity: 0.15,
          map,
          center: HOME_LOCATION,
          radius: SAFE_RADIUS_METERS,
        });
      }
    }
    return () => {
      if (safeZoneRef.current) {
        safeZoneRef.current.setMap(null);
        safeZoneRef.current = null;
      }
    };
  }, [isLoaded, map]);

  const simulateWandering = () => {
    setIsWandering(true);
    setCurrentLocation(WANDERING_LOCATION);
    if (map) {
      map.panTo(WANDERING_LOCATION);
      map.setZoom(18);
    }
    // Speak an emergency alert
    const utterance = new SpeechSynthesisUtterance("Emergency Alert: Ramesh Kumar has left the safe zone.");
    utterance.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const simulateReturn = () => {
    setIsWandering(false);
    setCurrentLocation(HOME_LOCATION);
    if (map) {
      map.panTo(HOME_LOCATION);
      map.setZoom(19);
    }
  };

  if (loadError) {
    return (
      <div className="location-tracker-error">
        <AlertTriangle className="mr-2" />
        Map load error: {loadError.message}
      </div>
    );
  }

  if (!isLoaded) {
    return <div className="location-tracker-loading">Loading Map...</div>;
  }

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

      <div className="lt-map-container">
        {!GOOGLE_MAPS_API_KEY && (
          <div className="lt-api-warning">
            ⚠️ No Google Maps API Key found in .env. Map will show "For development purposes only".
          </div>
        )}
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={HOME_LOCATION}
          zoom={19}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            mapTypeId: 'satellite'
          }}
        >
          {/* Custom Patient Marker */}
          <OverlayView
            position={currentLocation}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div className={`lt-patient-marker ${isWandering ? 'marker-danger pulse' : ''}`}>
              <img src={patient.photo} alt={patient.name} className="lt-patient-avatar" />
              <div className="lt-marker-ring"></div>
            </div>
          </OverlayView>

          {/* Home Marker */}
          <OverlayView
            position={HOME_LOCATION}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div className="lt-home-marker">
              <MapPin size={24} fill="#e74c3c" color="white" />
            </div>
          </OverlayView>
        </GoogleMap>
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
