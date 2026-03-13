import { useState } from 'react';
import { AlertTriangle, X, Phone, MapPin, User, Heart, Shield } from 'lucide-react';
import { patient, familyMembers } from '../data/patientData';
import './SOSButton.css';

export default function SOSButton() {
  const [showPanel, setShowPanel] = useState(false);

  const handleSOS = () => {
    setShowPanel(true);

    // Speak calming message
    const calming = `Everything is okay, ${patient.name}. You are safe at home in ${patient.location}. Your family loves you. Take a deep breath. Help is here.`;
    const utterance = new SpeechSynthesisUtterance(calming);
    utterance.rate = 0.75;
    utterance.pitch = 1.0;
    utterance.lang = 'en-IN';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const closePanel = () => {
    setShowPanel(false);
    window.speechSynthesis.cancel();
  };

  return (
    <>
      <button
        className="sos-floating-btn"
        onClick={handleSOS}
        title="Emergency — I need help"
        aria-label="SOS Emergency Button"
      >
        <Shield size={24} />
        <span className="sos-label">SOS</span>
        <div className="sos-pulse-ring" />
        <div className="sos-pulse-ring sos-ring-2" />
      </button>

      {showPanel && (
        <div className="sos-overlay" onClick={closePanel}>
          <div className="sos-panel animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <button className="sos-close" onClick={closePanel}>
              <X size={24} />
            </button>

            <div className="sos-header">
              <div className="sos-icon-wrap">
                <Heart size={32} />
              </div>
              <h2>You Are Safe 💛</h2>
              <p className="sos-calming-text">
                Take a deep breath. Everything is okay.
              </p>
            </div>

            <div className="sos-identity-card">
              <div className="sos-id-header">
                <User size={18} />
                <span>Your Identity Card</span>
              </div>
              <div className="sos-id-body">
                <img src={patient.photo} alt={patient.name} className="sos-id-photo" />
                <div className="sos-id-info">
                  <h3>{patient.name}</h3>
                  <p>Age: {patient.age}</p>
                  <p><MapPin size={14} /> {patient.location}</p>
                </div>
              </div>
            </div>

            <div className="sos-contacts">
              <h4 className="sos-contacts-title">
                <Phone size={16} />
                Emergency Contacts
              </h4>
              {familyMembers.map((member) => (
                <div key={member.id} className="sos-contact-card">
                  <img src={member.photo} alt={member.name} className="sos-contact-photo" />
                  <div className="sos-contact-info">
                    <span className="sos-contact-name">{member.name}</span>
                    <span className="sos-contact-rel">{member.relationship}</span>
                  </div>
                  <button className="sos-call-btn" title={`Call ${member.name}`}>
                    <Phone size={16} />
                    Call
                  </button>
                </div>
              ))}
            </div>

            <div className="sos-breathing">
              <div className="sos-breath-circle" />
              <p>Breathe in... and out...</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
