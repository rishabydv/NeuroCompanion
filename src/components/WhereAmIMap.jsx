import { MapPin, Volume2, Home, Shield } from 'lucide-react';
import { patient } from '../data/patientData';
import './WhereAmIMap.css';

export default function WhereAmIMap() {
  const speakLocation = () => {
    const text = `You are at home in ${patient.location}. This is your house where you have lived for over 35 years. You are safe here. Your family is nearby.`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.82;
    utterance.lang = 'en-IN';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="where-am-i">
      <div className="wai-map-area">
        <div className="wai-map-illustration">
          {/* Stylized map illustration */}
          <div className="wai-grid">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="wai-grid-cell" />
            ))}
          </div>
          <div className="wai-roads">
            <div className="wai-road wai-road-h" />
            <div className="wai-road wai-road-v" />
          </div>
          <div className="wai-home-marker">
            <div className="wai-marker-pin">
              <Home size={20} />
            </div>
            <div className="wai-marker-pulse" />
            <div className="wai-marker-label">Your Home</div>
          </div>
          <div className="wai-landmark wai-landmark-1">
            <span>🌳</span>
            <small>Deer Park</small>
          </div>
          <div className="wai-landmark wai-landmark-2">
            <span>🏪</span>
            <small>Market</small>
          </div>
          <div className="wai-landmark wai-landmark-3">
            <span>🕌</span>
            <small>Temple</small>
          </div>
        </div>
      </div>

      <div className="wai-info">
        <div className="wai-status">
          <Shield size={16} />
          <span>You are safe</span>
        </div>
        <h3 className="wai-location">
          <MapPin size={20} />
          {patient.location}
        </h3>
        <p className="wai-description">
          This is your home. You have lived here for over 35 years. 
          Your neighborhood has Deer Park, the market, and the temple nearby.
        </p>
        <button className="wai-speak-btn" onClick={speakLocation}>
          <Volume2 size={16} />
          Hear your location
        </button>
      </div>
    </div>
  );
}
